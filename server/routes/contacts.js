const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Contact = require('../models/Contact');

// Get all contacts with pagination and filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.projectType) filter.projectType = req.query.projectType;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.priority) filter.priority = req.query.priority;

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { subject: searchRegex }
      ];
    }

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    // Sort options
    const sortOptions = {};
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortBy] = sortOrder;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});

// Get single contact by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
});

// Update contact
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error.message
    });
  }
});

// Delete contact
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
});

// Bulk actions
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { action, ids, data } = req.body;

    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Action and contact IDs are required'
      });
    }

    let result;

    switch (action) {
      case 'update':
        if (!data) {
          return res.status(400).json({
            success: false,
            message: 'Update data is required'
          });
        }
        result = await Contact.updateMany(
          { _id: { $in: ids } },
          data,
          { runValidators: true }
        );
        break;

      case 'delete':
        result = await Contact.deleteMany({ _id: { $in: ids } });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      affected: result.modifiedCount || result.deletedCount
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to perform bulk ${req.body.action}`,
      error: error.message
    });
  }
});

// Export contacts
router.get('/export/csv', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    // Convert to CSV format
    const csvHeader = [
      'ID', 'Name', 'Email', 'Company', 'Phone', 'Subject', 'Message',
      'Project Type', 'Budget', 'Status', 'Priority', 'Source', 'Value',
      'Created Date', 'Updated Date'
    ].join(',');

    const csvRows = contacts.map(contact => [
      contact._id,
      `"${contact.name}"`,
      contact.email,
      `"${contact.company || ''}"`,
      contact.phone || '',
      `"${contact.subject}"`,
      `"${contact.message.replace(/"/g, '""')}"`,
      contact.projectType,
      contact.budget,
      contact.status,
      contact.priority,
      contact.source,
      contact.value,
      contact.createdAt.toISOString(),
      contact.updatedAt.toISOString()
    ].join(','));

    const csv = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=panchroma-contacts-${Date.now()}.csv`);
    res.send(csv);

  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export contacts',
      error: error.message
    });
  }
});

module.exports = router;