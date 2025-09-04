const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Project = require('../models/Project');
const Contact = require('../models/Contact');

// Get all projects with pagination and filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.projectType) filter.projectType = req.query.projectType;
    if (req.query.priority) filter.priority = req.query.priority;

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { clientName: searchRegex },
        { clientEmail: searchRegex },
        { clientCompany: searchRegex },
        { description: searchRegex }
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

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('contactId', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        projects,
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
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// Get single project by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('contactId');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// Create new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const projectData = req.body;

    // If contactId is provided, validate it exists
    if (projectData.contactId) {
      const contact = await Contact.findById(projectData.contactId);
      if (!contact) {
        return res.status(400).json({
          success: false,
          message: 'Contact not found'
        });
      }
    }

    const project = new Project(projectData);
    await project.save();

    // Populate the contact details
    await project.populate('contactId');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;

    // If status is being updated to completed, set completedDate
    if (updates.status === 'completed' && !updates.completedDate) {
      updates.completedDate = new Date();
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('contactId');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// Update milestone
router.put('/:id/milestones/:milestoneIndex', authMiddleware, async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.milestones[milestoneIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Update milestone
    Object.assign(project.milestones[milestoneIndex], updates);

    // If marking as completed, set completedDate
    if (updates.completed && !project.milestones[milestoneIndex].completedDate) {
      project.milestones[milestoneIndex].completedDate = new Date();
    }

    await project.save();

    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
});

// Add file to project
router.post('/:id/files', authMiddleware, async (req, res) => {
  try {
    const { name, url, type } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.files.push({ name, url, type });
    await project.save();

    res.json({
      success: true,
      message: 'File added successfully',
      data: project
    });

  } catch (error) {
    console.error('Add file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add file',
      error: error.message
    });
  }
});

// Remove file from project
router.delete('/:id/files/:fileId', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.files = project.files.filter(file => file._id.toString() !== req.params.fileId);
    await project.save();

    res.json({
      success: true,
      message: 'File removed successfully',
      data: project
    });

  } catch (error) {
    console.error('Remove file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove file',
      error: error.message
    });
  }
});

// Convert contact to project
router.post('/from-contact/:contactId', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const projectData = {
      title: req.body.title || `${contact.projectType} for ${contact.name}`,
      description: req.body.description || contact.message,
      clientName: contact.name,
      clientEmail: contact.email,
      clientCompany: contact.company,
      projectType: contact.projectType,
      budget: req.body.budget || 0,
      priority: contact.priority,
      contactId: contact._id,
      ...req.body // Allow override of any field
    };

    const project = new Project(projectData);
    await project.save();

    // Update contact status to indicate it's been converted
    contact.status = 'quoted';
    await contact.save();

    await project.populate('contactId');

    res.status(201).json({
      success: true,
      message: 'Project created from contact successfully',
      data: project
    });

  } catch (error) {
    console.error('Convert contact to project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project from contact',
      error: error.message
    });
  }
});

module.exports = router;