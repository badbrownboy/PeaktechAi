const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { resumeValidation, handleValidationErrors } = require('../middleware/validation');
const { upload, handleMulterError } = require('../middleware/upload');
const emailService = require('../services/emailService');

// POST /api/resume - Handle resume submissions
router.post('/', 
  upload.single('resume'), 
  handleMulterError,
  resumeValidation, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { firstName, lastName, email, phone, position, experience, skills, coverLetter } = req.body;
      
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Resume file is required'
        });
      }
      
      // Get client IP and user agent for security/analytics
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      // Parse skills if it's a string
      let parsedSkills = skills;
      if (typeof skills === 'string') {
        try {
          parsedSkills = JSON.parse(skills);
        } catch {
          parsedSkills = skills.split(',').map(skill => skill.trim());
        }
      }
      
      // Create resume record
      const resume = new Resume({
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        skills: parsedSkills,
        resume: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        coverLetter,
        ipAddress,
        userAgent
      });
      
      await resume.save();
      
      // Send confirmation email to user
      try {
        await emailService.sendResumeConfirmation({
          firstName,
          lastName,
          email,
          position,
          experience,
          resume: {
            originalName: req.file.originalname
          }
        });
      } catch (emailError) {
        console.error('Failed to send resume confirmation email:', emailError);
      }
      
      // Send notification to admin
      try {
        await emailService.sendInternalNotification('resume', {
          firstName,
          lastName,
          email,
          position,
          experience,
          resume: {
            originalName: req.file.originalname
          }
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
      
      res.status(201).json({
        success: true,
        message: 'Resume submitted successfully',
        data: {
          id: resume._id,
          firstName: resume.firstName,
          lastName: resume.lastName,
          email: resume.email,
          position: resume.position,
          submittedAt: resume.createdAt
        }
      });
      
    } catch (error) {
      console.error('Resume submission error:', error);
      
      // Handle duplicate email submissions
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A resume with this email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit resume'
      });
    }
  }
);

// GET /api/resume - Get all resumes (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, position, experience, search } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (position) query.position = { $regex: position, $options: 'i' };
    if (experience) query.experience = experience;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    const resumes = await Resume.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress'); // Exclude sensitive fields
    
    const total = await Resume.countDocuments(query);
    
    res.json({
      success: true,
      data: resumes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resumes'
    });
  }
});

// GET /api/resume/:id - Get specific resume (admin only)
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      data: resume
    });
    
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume'
    });
  }
});

// PATCH /api/resume/:id - Update resume status (admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status && { status }),
        ...(notes && { notes })
      },
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      data: resume
    });
    
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume'
    });
  }
});

// GET /api/resume/download/:id - Download resume file (admin only)
router.get('/download/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    const filePath = resume.resume.path;
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }
    
    res.download(filePath, resume.resume.originalName);
    
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
});

module.exports = router;
