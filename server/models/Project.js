const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  clientCompany: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['Website Design', 'E-commerce', 'Mobile App', 'Web Application', 'Consulting', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'design', 'development', 'testing', 'review', 'completed', 'on-hold', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  technologies: [{
    type: String
  }],
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  files: [{
    name: String,
    url: String,
    type: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }
}, {
  timestamps: true
});

// Index for better performance
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ dueDate: 1 });
projectSchema.index({ clientEmail: 1 });

module.exports = mongoose.model('Project', projectSchema);