# X TECH Backend Server Configuration Guide

## 🚀 Quick Setup Instructions

### 1. Database Setup (MongoDB Atlas - Recommended)

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user with password
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)
6. Get your connection string and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/xtech
   ```

**Option B: Local MongoDB**
1. Install MongoDB: `brew install mongodb-community` (macOS)
2. Start MongoDB: `brew services start mongodb-community`
3. Keep the default in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/xtech
   ```

### 2. Email Configuration

**Option A: Gmail (Recommended for testing)**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ADMIN_EMAIL=your-email@gmail.com
   ```

**Option B: SendGrid (Recommended for production)**
1. Create account at [SendGrid](https://sendgrid.com/)
2. Get API key from Settings → API Keys
3. Update `.env`:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

### 3. Frontend URL Configuration

Update the FRONTEND_URL in `.env` to match your X TECH website:
```
FRONTEND_URL=http://localhost:3000
# or for production:
FRONTEND_URL=https://yourdomain.com
```

### 4. Test the Configuration

Run the server:
```bash
npm run dev
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Open the admin dashboard:
```bash
open admin-dashboard.html
```

## 🔧 Configuration Status

- [ ] MongoDB connection configured
- [ ] Email service configured  
- [ ] Frontend URL updated
- [ ] Server tested and running
- [ ] API endpoints tested

## 📧 Email Templates

The server sends these emails automatically:
- **Contact Form**: Confirmation to user + notification to admin
- **Resume Upload**: Confirmation to applicant + notification to admin
- **Project Submission**: Confirmation to client + notification to admin

## 🛡️ Security Features Enabled

- Rate limiting (100 requests/15min, 5 forms/hour)
- Input validation and sanitization
- File type and size validation
- CORS protection
- Security headers (Helmet)
- IP logging for security audit

## 🚨 Troubleshooting

**Database Connection Error:**
- Check MongoDB URI format
- Verify database user credentials
- Ensure IP whitelist includes your IP

**Email Not Sending:**
- Check SMTP credentials
- Verify App Password (not regular password for Gmail)
- Check firewall/network restrictions

**CORS Errors:**
- Update FRONTEND_URL to match your frontend domain
- Ensure both HTTP and HTTPS are configured if needed

## 📝 Next Steps

1. Configure your `.env` file with actual values
2. Test the server with `npm run dev`
3. Test API endpoints with admin dashboard
4. Connect your frontend to the backend
5. Deploy to production when ready
