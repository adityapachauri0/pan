const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Contact = require('../models/Contact');
const Project = require('../models/Project');

// Get dashboard metrics
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total counts
    const [totalContacts, totalProjects, activeProjects] = await Promise.all([
      Contact.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['planning', 'design', 'development', 'testing', 'review'] } })
    ]);

    // Get recent counts (last 7 days)
    const [newContactsWeek, newProjectsWeek] = await Promise.all([
      Contact.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Project.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // Get monthly counts
    const [contactsThisMonth, projectsThisMonth] = await Promise.all([
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Project.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    const [contactsLastMonth, projectsLastMonth] = await Promise.all([
      Contact.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      }),
      Project.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      })
    ]);

    // Calculate conversion rate (contacts to projects)
    const conversionRate = totalContacts > 0 ? ((totalProjects / totalContacts) * 100).toFixed(1) : 0;

    // Calculate revenue metrics
    const [totalRevenue, monthlyRevenue, paidAmount] = await Promise.all([
      Project.aggregate([{ $group: { _id: null, total: { $sum: '$budget' } } }]),
      Project.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$budget' } } }
      ]),
      Project.aggregate([{ $group: { _id: null, total: { $sum: '$paid' } } }])
    ]);

    const totalBudget = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    const monthlyBudget = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;
    const totalPaid = paidAmount.length > 0 ? paidAmount[0].total : 0;

    // Calculate growth percentages
    const contactGrowth = contactsLastMonth > 0 
      ? (((contactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100).toFixed(1)
      : contactsThisMonth > 0 ? 100 : 0;

    const projectGrowth = projectsLastMonth > 0 
      ? (((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100).toFixed(1)
      : projectsThisMonth > 0 ? 100 : 0;

    // Get pending contacts (new status)
    const pendingContacts = await Contact.countDocuments({ status: 'new' });

    // Get overdue projects
    const overdueProjects = await Project.countDocuments({
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: now }
    });

    const metrics = {
      // Main metrics
      totalContacts,
      newContacts: newContactsWeek,
      totalProjects,
      newProjects: newProjectsWeek,
      activeProjects,
      
      // Conversion & Revenue
      conversionRate: parseFloat(conversionRate),
      totalRevenue: totalBudget,
      monthlyRevenue: monthlyBudget,
      totalPaid,
      pendingAmount: totalBudget - totalPaid,
      
      // Growth metrics
      contactGrowth: parseFloat(contactGrowth),
      projectGrowth: parseFloat(projectGrowth),
      
      // Alerts
      pendingContacts,
      overdueProjects,
      
      // Monthly data
      contactsThisMonth,
      projectsThisMonth,
      
      // Performance metrics
      averageProjectValue: totalProjects > 0 ? Math.round(totalBudget / totalProjects) : 0,
      completionRate: totalProjects > 0 
        ? ((await Project.countDocuments({ status: 'completed' })) / totalProjects * 100).toFixed(1)
        : 0
    };

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics',
      error: error.message
    });
  }
});

// Get recent activity
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent contacts and projects
    const [recentContacts, recentProjects] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email subject status createdAt projectType'),
      Project.find()
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('title clientName status updatedAt projectType priority')
    ]);

    // Combine and sort by date
    const activity = [
      ...recentContacts.map(contact => ({
        id: contact._id,
        type: 'contact',
        title: `New contact from ${contact.name}`,
        subtitle: contact.subject,
        status: contact.status,
        date: contact.createdAt,
        priority: 'medium',
        icon: 'contact'
      })),
      ...recentProjects.map(project => ({
        id: project._id,
        type: 'project',
        title: `Project: ${project.title}`,
        subtitle: `Client: ${project.clientName}`,
        status: project.status,
        date: project.updatedAt,
        priority: project.priority || 'medium',
        icon: 'project'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
     .slice(0, limit);

    res.json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('Dashboard activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
});

// Get chart data for analytics
router.get('/charts/:type', authMiddleware, async (req, res) => {
  try {
    const { type } = req.params;
    const { period = '30' } = req.query;
    
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let data = [];

    switch (type) {
      case 'contacts':
        // Daily contact submissions
        data = await Contact.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        break;

      case 'projects':
        // Project status distribution
        data = await Project.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'revenue':
        // Monthly revenue
        data = await Project.aggregate([
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              budget: { $sum: '$budget' },
              paid: { $sum: '$paid' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      case 'sources':
        // Contact sources
        data = await Contact.aggregate([
          {
            $group: {
              _id: '$source',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid chart type'
        });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Dashboard charts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
});

module.exports = router;