#!/bin/bash

# X TECH Backend Server Setup Script

echo "🚀 Setting up X TECH Backend Server..."
echo "======================================"

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file from example..."
  cp .env.example .env
  echo "✅ .env file created! Please update it with your actual configuration."
  echo "🔧 You need to set:"
  echo "   - MONGODB_URI (your MongoDB connection string)"
  echo "   - SMTP_USER and SMTP_PASS (your email credentials)"
  echo "   - ADMIN_EMAIL (where notifications will be sent)"
  echo "   - JWT_SECRET (a secure random string)"
else
  echo "✅ .env file already exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
  echo "📁 Creating uploads directory..."
  mkdir -p uploads/resumes uploads/projects
  echo "✅ Upload directories created"
else
  echo "✅ Upload directories already exist"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with actual values"
echo "2. Start MongoDB (if using local installation)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Test the server with './test-server.sh'"
echo ""
echo "📚 See README.md for detailed documentation"
