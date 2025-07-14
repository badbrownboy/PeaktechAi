const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { projectValidation, handleValidationErrors } = require('../middleware/validation');
const { upload, handleMulterError } = require('../middleware/upload');
const emailService = require('../services/emailService');

// POST /api/project - Handle project submissions
router.post('/', 
  upload.array('attachments', 5), 
  handleMulterError,
  projectValidation, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        company, 
        projectTitle, 
        projectDescription, 
        projectType, 
        budget, 
        timeline, 
        technologies, 
        requirements 
      } = req.body;
      
      // Get client IP and user agent for security/analytics
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      // Parse arrays if they're strings
      let parsedTechnologies = technologies;
      if (typeof technologies === 'string') {
        try {
          parsedTechnologies = JSON.parse(technologies);
        } catch {
          parsedTechnologies = technologies.split(',').map(tech => tech.trim());
        }
      }
      
      let parsedRequirements = requirements;
      if (typeof requirements === 'string') {
        try {
          parsedRequirements = JSON.parse(requirements);
        } catch {
          parsedRequirements = requirements.split(',').map(req => req.trim());
        }
      }
      
      // Process attachments
      const attachments = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          attachments.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
          });
        }
      }
      
      // Create project record
      const project = new Project({
        firstName,
        lastName,
        email,
        company,
        projectTitle,
        projectDescription,
        projectType,
        budget,
        timeline,
        technologies: parsedTechnologies,
        requirements: parsedRequirements,
        attachments,
        ipAddress,
        userAgent
      });
      
      await project.save();
      
      // Send confirmation email to user
      try {
        await emailService.sendProjectConfirmation({
          firstName,
          lastName,
          email,
          projectTitle,
          projectType,
          budget,
          timeline
        });
      } catch (emailError) {
        console.error('Failed to send project confirmation email:', emailError);
      }
      
      // Send notification to admin
      try {
        await emailService.sendInternalNotification('project', {
          firstName,
          lastName,
          email,
          company,
          projectTitle,
          projectType,
          budget,
          timeline
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
      
      res.status(201).json({
        success: true,
        message: 'Project submitted successfully',
        data: {
          id: project._id,
          firstName: project.firstName,
          lastName: project.lastName,
          email: project.email,
          projectTitle: project.projectTitle,
          projectType: project.projectType,
          submittedAt: project.createdAt
        }
      });
      
    } catch (error) {
      console.error('Project submission error:', error);
      
      // Handle duplicate email submissions
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A project with this email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit project'
      });
    }
  }
);

// GET /api/project - Get all projects (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, projectType, budget, priority, search } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    if (budget) query.budget = budget;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { projectTitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress'); // Exclude sensitive fields
    
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects'
    });
  }
});

// GET /api/project/:id - Get specific project (admin only)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
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
      message: 'Failed to retrieve project'
    });
  }
});

// PATCH /api/project/:id - Update project status (admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { status, priority, notes } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status && { status }),
        ...(priority && { priority }),
        ...(notes && { notes })
      },
      { new: true }
    );
    
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
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// GET /api/project/download/:id/:attachmentId - Download project attachment (admin only)
router.get('/download/:id/:attachmentId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const attachment = project.attachments.find(att => att._id.toString() === req.params.attachmentId);
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }
    
    const filePath = attachment.path;
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Attachment file not found'
      });
    }
    
    res.download(filePath, attachment.originalName);
    
  } catch (error) {
    console.error('Download attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download attachment'
    });
  }
});

module.exports = router;
