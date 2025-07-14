# X TECH Backend Server

A robust Node.js Express backend server for handling form submissions, file uploads, and email notifications for the X TECH website.

## Features

- **Form Handling**: Contact forms, resume uploads, and project submissions
- **File Upload**: Secure file upload with validation for resumes and project attachments
- **Email Notifications**: Automated confirmation emails and admin notifications
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Security**: Rate limiting, input validation, file type checking, and CORS protection
- **API Documentation**: RESTful API with consistent response formats

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: Helmet, CORS, express-rate-limit, express-validator
- **Development**: Nodemon

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - Email SMTP settings
   - JWT secret
   - Admin email

5. Start MongoDB (if running locally)

6. Run the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/xtech
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@xtech.com
ADMIN_EMAIL=admin@xtech.com
JWT_SECRET=your-super-secret-jwt-key-here
```

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `PATCH /api/contact/:id` - Update contact status (admin)

### Resume Submissions
- `POST /api/resume` - Submit resume with file upload
- `GET /api/resume` - Get all resumes (admin)
- `GET /api/resume/:id` - Get specific resume (admin)
- `PATCH /api/resume/:id` - Update resume status (admin)
- `GET /api/resume/download/:id` - Download resume file (admin)

### Project Submissions
- `POST /api/project` - Submit project with optional attachments
- `GET /api/project` - Get all projects (admin)
- `GET /api/project/:id` - Get specific project (admin)
- `PATCH /api/project/:id` - Update project status (admin)
- `GET /api/project/download/:id/:attachmentId` - Download project attachment (admin)

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check (admin)

## Request Examples

### Contact Form Submission
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "message": "I would like to discuss a project with you."
  }'
```

### Resume Submission
```bash
curl -X POST http://localhost:5000/api/resume \
  -F "firstName=Jane" \
  -F "lastName=Smith" \
  -F "email=jane@example.com" \
  -F "position=Frontend Developer" \
  -F "experience=mid" \
  -F "resume=@/path/to/resume.pdf"
```

### Project Submission
```bash
curl -X POST http://localhost:5000/api/project \
  -F "firstName=Mike" \
  -F "lastName=Johnson" \
  -F "email=mike@example.com" \
  -F "projectTitle=E-commerce Platform" \
  -F "projectDescription=Need a full-stack e-commerce solution" \
  -F "projectType=web-app" \
  -F "budget=25k-50k" \
  -F "attachments=@/path/to/mockup.pdf"
```

## Security Features

- Rate limiting (100 requests per 15 minutes, 5 form submissions per hour)
- Input validation and sanitization
- File type and size validation
- CORS protection
- Helmet security headers
- IP address and user agent logging

## File Upload Limits

- Maximum file size: 10MB
- Maximum files per request: 5
- Allowed file types:
  - Resumes: PDF, DOC, DOCX
  - Attachments: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, ZIP

## Development

```bash
# Start development server with auto-reload
npm run dev

# Check health
curl http://localhost:5000/api/health

# View logs
tail -f logs/app.log
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up MongoDB replica set
4. Configure email service (SendGrid, Mailgun, etc.)
5. Set up reverse proxy (Nginx)
6. Enable HTTPS
7. Set up monitoring and logging

## Database Schema

### Contact
- firstName, lastName, email, company, message
- status: new, contacted, in-progress, completed, closed
- timestamps, IP address, user agent

### Resume
- Personal info, position, experience, skills
- File upload details
- status: new, reviewed, shortlisted, interview, rejected, hired
- timestamps, IP address, user agent

### Project
- Personal info, project details, requirements
- File attachments
- status: new, reviewing, proposal-sent, negotiating, approved, in-progress, completed, rejected
- priority: low, medium, high, urgent
- timestamps, IP address, user agent

## License

ISC
