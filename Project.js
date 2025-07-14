const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  projectTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  projectDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  projectType: {
    type: String,
    enum: ['web-app', 'mobile-app', 'ai-solution', 'platform', 'integration', 'other'],
    required: true
  },
  budget: {
    type: String,
    enum: ['under-10k', '10k-25k', '25k-50k', '50k-100k', '100k-plus', 'not-specified'],
    default: 'not-specified'
  },
  timeline: {
    type: String,
    enum: ['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'flexible'],
    default: 'flexible'
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  requirements: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }],
  status: {
    type: String,
    enum: ['new', 'reviewing', 'proposal-sent', 'negotiating', 'approved', 'in-progress', 'completed', 'rejected'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for searching
projectSchema.index({ email: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ budget: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
