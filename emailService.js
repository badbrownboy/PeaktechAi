const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Only create transporter if email credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.warn('Email credentials not provided. Email service will be disabled.');
      this.transporter = null;
    }
  }

  async sendContactConfirmation(contactData) {
    if (!this.transporter) {
      console.log('Email service disabled - would send contact confirmation to:', contactData.email);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@xtech.com',
      to: contactData.email,
      subject: 'Thank you for contacting X TECH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <p>Hi ${contactData.firstName},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Your Message:</h3>
            <p style="font-style: italic;">"${contactData.message}"</p>
          </div>
          
          <p>Best regards,<br>The X TECH Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendResumeConfirmation(resumeData) {
    if (!this.transporter) {
      console.log('Email service disabled - would send resume confirmation to:', resumeData.email);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@xtech.com',
      to: resumeData.email,
      subject: 'Resume Received - X TECH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your application!</h2>
          <p>Hi ${resumeData.firstName},</p>
          <p>We've received your resume for the <strong>${resumeData.position}</strong> position.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Application Details:</h3>
            <p><strong>Position:</strong> ${resumeData.position}</p>
            <p><strong>Experience Level:</strong> ${resumeData.experience}</p>
            <p><strong>Resume:</strong> ${resumeData.resume.originalName}</p>
          </div>
          
          <p>We'll review your application and contact you if there's a match.</p>
          
          <p>Best regards,<br>The X TECH Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendProjectConfirmation(projectData) {
    if (!this.transporter) {
      console.log('Email service disabled - would send project confirmation to:', projectData.email);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@xtech.com',
      to: projectData.email,
      subject: 'Project Inquiry Received - X TECH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your project inquiry!</h2>
          <p>Hi ${projectData.firstName},</p>
          <p>We've received your project details and are excited to learn more about your idea.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Project Overview:</h3>
            <p><strong>Title:</strong> ${projectData.projectTitle}</p>
            <p><strong>Type:</strong> ${projectData.projectType}</p>
            <p><strong>Budget:</strong> ${projectData.budget}</p>
            <p><strong>Timeline:</strong> ${projectData.timeline}</p>
          </div>
          
          <p>Our team will review your project and get back to you within 2 business days with next steps.</p>
          
          <p>Best regards,<br>The X TECH Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendInternalNotification(type, data) {
    if (!this.transporter) {
      console.log('Email service disabled - would send internal notification:', type);
      return { success: false, message: 'Email service not configured' };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@xtech.com';
    
    let subject = '';
    let content = '';
    
    switch (type) {
      case 'contact':
        subject = `New Contact Form Submission - ${data.firstName} ${data.lastName}`;
        content = `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">${data.message}</p>
        `;
        break;
      case 'resume':
        subject = `New Resume Submission - ${data.firstName} ${data.lastName}`;
        content = `
          <h3>New Resume Submission</h3>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Position:</strong> ${data.position}</p>
          <p><strong>Experience:</strong> ${data.experience}</p>
          <p><strong>Resume:</strong> ${data.resume.originalName}</p>
        `;
        break;
      case 'project':
        subject = `New Project Inquiry - ${data.projectTitle}`;
        content = `
          <h3>New Project Inquiry</h3>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Project Title:</strong> ${data.projectTitle}</p>
          <p><strong>Type:</strong> ${data.projectType}</p>
          <p><strong>Budget:</strong> ${data.budget}</p>
          <p><strong>Timeline:</strong> ${data.timeline}</p>
        `;
        break;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@xtech.com',
      to: adminEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${content}
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async testConnection() {
    if (!this.transporter) {
      console.log('Email service disabled - cannot test connection');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
