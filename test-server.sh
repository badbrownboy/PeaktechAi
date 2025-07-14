#!/bin/bash

# X TECH Backend Server Test Script

echo "🚀 Testing X TECH Backend Server..."
echo "=================================="

# Test health endpoint
echo "📋 Testing health endpoint..."
curl -s http://localhost:5000/api/health | jq '.' 2>/dev/null || echo "Server not running or jq not installed"

echo ""
echo "📝 Testing contact form submission..."
curl -s -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "company": "Test Company",
    "message": "This is a test message to verify the contact form is working."
  }' | jq '.' 2>/dev/null || echo "Contact form test failed"

echo ""
echo "🎯 Testing project submission..."
curl -s -X POST http://localhost:5000/api/project \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "project@example.com",
    "projectTitle": "Test Project",
    "projectDescription": "This is a test project to verify the project submission is working.",
    "projectType": "web-app",
    "budget": "10k-25k",
    "timeline": "2-3-months"
  }' | jq '.' 2>/dev/null || echo "Project submission test failed"

echo ""
echo "✅ Test completed! Check the responses above."
echo "💡 Make sure MongoDB is running and environment variables are set."
