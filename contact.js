const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { contactValidation, handleValidationErrors } = require('../middleware/validation');
const emailService = require('../services/emailService');

// POST /api/contact - Handle contact form submissions
router.post('/', contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, company, message } = req.body;
    
    // Get client IP and user agent for security/analytics
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Create contact record
    const contact = new Contact({
      firstName,
      lastName,
      email,
      company,
      message,
      ipAddress,
      userAgent
    });
    
    await contact.save();
    
    // Send confirmation email to user
    try {
      await emailService.sendContactConfirmation({
        firstName,
        lastName,
        email,
        message
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send notification to admin
    try {
      await emailService.sendInternalNotification('contact', {
        firstName,
        lastName,
        email,
        company,
        message
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        submittedAt: contact.createdAt
      }
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    // Handle duplicate email submissions
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A submission with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

// GET /api/contact - Get all contacts (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress'); // Exclude sensitive fields
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts'
    });
  }
});

// PATCH /api/contact/:id - Update contact status (admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status && { status }),
        ...(notes && { notes })
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
    
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

module.exports = router;
