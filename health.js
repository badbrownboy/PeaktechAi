const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const emailService = require('../services/emailService');

// GET /api/health - Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'checking...',
        email: 'checking...'
      }
    };

    // Check database connection
    try {
      await mongoose.connection.db.admin().ping();
      healthCheck.services.database = 'connected';
    } catch (error) {
      healthCheck.services.database = 'disconnected';
      healthCheck.status = 'DEGRADED';
    }

    // Check email service
    try {
      const emailStatus = await emailService.testConnection();
      healthCheck.services.email = emailStatus ? 'connected' : 'disconnected';
      if (!emailStatus) {
        healthCheck.status = 'DEGRADED';
      }
    } catch (error) {
      healthCheck.services.email = 'error';
      healthCheck.status = 'DEGRADED';
    }

    // Set appropriate status code
    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      data: healthCheck
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// GET /api/health/detailed - Detailed health check (admin only)
router.get('/detailed', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const Resume = require('../models/Resume');
    const Project = require('../models/Project');
    
    const detailedHealth = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
        unit: 'MB'
      },
      database: {
        status: 'checking...',
        collections: {}
      },
      services: {
        email: 'checking...'
      }
    };

    // Check database and collection stats
    try {
      await mongoose.connection.db.admin().ping();
      detailedHealth.database.status = 'connected';
      
      // Get collection stats
      const contactCount = await Contact.countDocuments();
      const resumeCount = await Resume.countDocuments();
      const projectCount = await Project.countDocuments();
      
      detailedHealth.database.collections = {
        contacts: contactCount,
        resumes: resumeCount,
        projects: projectCount
      };
      
    } catch (error) {
      detailedHealth.database.status = 'disconnected';
      detailedHealth.database.error = error.message;
      detailedHealth.status = 'DEGRADED';
    }

    // Check email service
    try {
      const emailStatus = await emailService.testConnection();
      detailedHealth.services.email = emailStatus ? 'connected' : 'disconnected';
      if (!emailStatus) {
        detailedHealth.status = 'DEGRADED';
      }
    } catch (error) {
      detailedHealth.services.email = 'error';
      detailedHealth.services.emailError = error.message;
      detailedHealth.status = 'DEGRADED';
    }

    // Set appropriate status code
    const statusCode = detailedHealth.status === 'OK' ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      data: detailedHealth
    });
    
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Detailed health check failed',
      error: error.message
    });
  }
});

module.exports = router;
