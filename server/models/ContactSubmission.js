const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxLength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    maxLength: 500
  },
  location: {
    city: String,
    region: String,
    country: String,
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['new', 'read', 'contacted', 'converted', 'archived'],
    default: 'new'
  },
  notes: {
    type: String,
    maxLength: 1000
  },
  repliedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ status: 1 });

// Virtual for time ago
contactSubmissionSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + ' years ago';
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + ' months ago';
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + ' days ago';
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + ' hours ago';
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);