const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');
const getClientIp = require('../utils/getClientIp');
const axios = require('axios');

// Middleware to check authentication (only for admin routes)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  // For now, just check if token exists (simple auth)
  next();
};

// Get all submissions (for dashboard - requires auth)
router.get('/submissions', authMiddleware, async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await ContactSubmission.countDocuments(query);
    
    // Get paginated results
    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Add timeAgo to each submission
    const submissionsWithTimeAgo = submissions.map(sub => {
      const seconds = Math.floor((new Date() - new Date(sub.createdAt)) / 1000);
      let timeAgo;
      
      if (seconds < 60) {
        timeAgo = 'Just now';
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (seconds < 2592000) {
        const days = Math.floor(seconds / 86400);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        const months = Math.floor(seconds / 2592000);
        timeAgo = `${months} month${months > 1 ? 's' : ''} ago`;
      }

      return { ...sub, timeAgo };
    });

    // Get stats
    const stats = {
      total: await ContactSubmission.countDocuments(),
      new: await ContactSubmission.countDocuments({ status: 'new' }),
      contacted: await ContactSubmission.countDocuments({ status: 'contacted' }),
      converted: await ContactSubmission.countDocuments({ status: 'converted' })
    };

    res.json({
      success: true,
      submissions: submissionsWithTimeAgo,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      stats
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Error fetching submissions' });
  }
});

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Get IP address with proper public IP detection
    let ipAddress = await getClientIp(req);
    
    // If localhost, try to get public IP for testing
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1') {
      try {
        const response = await axios.get('https://api.ipify.org?format=json', { timeout: 2000 });
        ipAddress = response.data.ip || ipAddress;
      } catch (error) {
        console.log('Could not fetch public IP, using local:', ipAddress);
      }
    }
    
    // Get location data from IP
    let location = null;
    if (ipAddress && ipAddress !== 'unknown' && !ipAddress.includes('127.0.0.1') && !ipAddress.includes('::1')) {
      try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress.replace(' (dev)', '')}`, { timeout: 2000 });
        if (geoResponse.data.status === 'success') {
          location = {
            city: geoResponse.data.city || 'Unknown',
            region: geoResponse.data.regionName || 'Unknown',
            country: geoResponse.data.country || 'Unknown',
            lat: geoResponse.data.lat,
            lng: geoResponse.data.lon
          };
        }
      } catch (error) {
        console.log('Could not fetch location data');
        location = {
          city: 'Unknown',
          region: 'Unknown',
          country: 'Unknown'
        };
      }
    } else {
      location = {
        city: 'Local',
        region: 'Local',
        country: 'Local'
      };
    }
    
    const userAgent = req.get('user-agent') || '';

    // Create submission
    const submission = new ContactSubmission({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent,
      location
    });

    await submission.save();
    
    console.log('Contact form submission saved:', { 
      id: submission._id,
      name, 
      email, 
      subject, 
      ipAddress,
      location 
    });

    res.json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form'
    });
  }
});

// Update submission status (requires auth)
router.patch('/submissions/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { 
        status,
        ...(status === 'contacted' && { repliedAt: new Date() })
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, submission });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

// Update submission notes
router.patch('/submissions/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, submission });
  } catch (error) {
    console.error('Error updating submission notes:', error);
    res.status(500).json({ success: false, message: 'Error updating notes' });
  }
});

// Delete submission
router.delete('/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ success: false, message: 'Error deleting submission' });
  }
});

// Export submissions
router.get('/submissions/export', async (req, res) => {
  try {
    const submissions = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({ success: false, message: 'Error exporting submissions' });
  }
});

module.exports = router;