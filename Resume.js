const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  experience: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  resume: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'],
    default: 'new'
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
resumeSchema.index({ email: 1 });
resumeSchema.index({ position: 1 });
resumeSchema.index({ experience: 1 });
resumeSchema.index({ status: 1 });
resumeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
