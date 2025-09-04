const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  budget: {
    type: String,
    enum: ['Under $5K', '$5K - $15K', '$15K - $50K', '$50K+', 'To be discussed'],
    default: 'To be discussed'
  },
  projectType: {
    type: String,
    enum: ['Website Design', 'E-commerce', 'Mobile App', 'Web Application', 'Consulting', 'Other'],
    default: 'Website Design'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'in-progress', 'completed', 'cancelled'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'google', 'direct', 'other'],
    default: 'website'
  },
  notes: {
    type: String
  },
  value: {
    type: Number,
    default: 0
  },
  followUpDate: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better performance
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);