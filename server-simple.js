const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'testing-mode',
        email: 'testing-mode'
      }
    }
  });
});

// Simple contact form endpoint
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  console.log('Contact form submission:', { firstName, lastName, email, message });
  
  res.json({
    success: true,
    message: 'Contact form submitted successfully',
    data: {
      firstName,
      lastName,
      email,
      submittedAt: new Date().toISOString()
    }
  });
});

// Simple project form endpoint
app.post('/api/project', (req, res) => {
  const { firstName, lastName, email, projectTitle, projectDescription, projectType } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email || !projectTitle || !projectDescription) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  console.log('Project submission:', { firstName, lastName, email, projectTitle, projectType });
  
  res.json({
    success: true,
    message: 'Project submitted successfully',
    data: {
      firstName,
      lastName,
      email,
      projectTitle,
      projectType,
      submittedAt: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 X TECH Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Admin dashboard: open admin-dashboard.html in browser`);
  console.log('');
  console.log('✅ Server ready for testing!');
});
