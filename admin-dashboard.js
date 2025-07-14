// X TECH Admin Dashboard JavaScript
const API_BASE = 'http://localhost:3001/api';

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForms();
    
    // Auto-refresh data every 30 seconds
    setInterval(refreshData, 30000);
    
    // Initial data load
    refreshData();
});

// Initialize navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const sectionId = this.dataset.section + '-section';
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update section title
            updateSectionTitle(this.dataset.section);
        });
    });
}

// Update section title
function updateSectionTitle(section) {
    const sectionTitle = document.getElementById('section-title');
    const titles = {
        'dashboard': 'Dashboard Overview',
        'server-status': 'Server Status',
        'analytics': 'Analytics',
        'sales': 'Sales & Revenue',
        'orders': 'Order Management',
        'users': 'User Management',
        'forms': 'Form Submissions',
        'activity': 'Recent Activity',
        'api-testing': 'API Testing'
    };
    
    sectionTitle.textContent = titles[section] || 'Admin Dashboard';
}

// Initialize forms
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    const projectForm = document.getElementById('project-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        const resultDiv = document.getElementById('contact-result');
        resultDiv.style.display = 'block';
        
        if (response.ok) {
            resultDiv.innerHTML = `<div class="success">✅ Contact form submitted successfully!</div>`;
            resultDiv.className = 'result success';
        } else {
            resultDiv.innerHTML = `<div class="error">❌ Error: ${result.message}</div>`;
            resultDiv.className = 'result error';
        }
    } catch (error) {
        const resultDiv = document.getElementById('contact-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="error">❌ Network error: ${error.message}</div>`;
        resultDiv.className = 'result error';
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE}/project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        const resultDiv = document.getElementById('project-result');
        resultDiv.style.display = 'block';
        
        if (response.ok) {
            resultDiv.innerHTML = `<div class="success">✅ Project submitted successfully!</div>`;
            resultDiv.className = 'result success';
        } else {
            resultDiv.innerHTML = `<div class="error">❌ Error: ${result.message}</div>`;
            resultDiv.className = 'result error';
        }
    } catch (error) {
        const resultDiv = document.getElementById('project-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="error">❌ Network error: ${error.message}</div>`;
        resultDiv.className = 'result error';
    }
}

// Check server health
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        document.getElementById('health-status').textContent = data.data.status;
        document.getElementById('db-status').textContent = data.data.services.database;
        document.getElementById('email-status').textContent = data.data.services.email;
    } catch (error) {
        document.getElementById('health-status').textContent = 'Error';
        document.getElementById('db-status').textContent = 'Error';
        document.getElementById('email-status').textContent = 'Error';
    }
}

// Get form submission statistics
async function getStats() {
    try {
        const detailed = await fetch(`${API_BASE}/health/detailed`);
        const data = await detailed.json();
        
        if (data.data.database.collections) {
            document.getElementById('contact-count').textContent = data.data.database.collections.contacts || 0;
            document.getElementById('resume-count').textContent = data.data.database.collections.resumes || 0;
            document.getElementById('project-count').textContent = data.data.database.collections.projects || 0;
        }
    } catch (error) {
        console.error('Error getting stats:', error);
    }
}

// Get analytics data
async function getAnalytics() {
    try {
        // Simulate analytics data - replace with real API calls
        const analytics = {
            visitors: Math.floor(Math.random() * 10000) + 5000,
            activeUsers: Math.floor(Math.random() * 500) + 100,
            pageViews: Math.floor(Math.random() * 50000) + 20000
        };
        
        document.getElementById('visitor-count').textContent = analytics.visitors.toLocaleString();
        document.getElementById('active-users').textContent = analytics.activeUsers.toLocaleString();
        document.getElementById('page-views').textContent = analytics.pageViews.toLocaleString();
        
        // Update dashboard overview
        const overviewVisitors = document.getElementById('overview-visitors');
        if (overviewVisitors) {
            overviewVisitors.textContent = Math.floor(analytics.visitors / 30).toLocaleString();
        }
    } catch (error) {
        console.error('Error getting analytics:', error);
    }
}

// Get sales data
async function getSalesData() {
    try {
        // Simulate sales data - replace with real API calls
        const sales = {
            totalSales: Math.floor(Math.random() * 500000) + 100000,
            monthlyRevenue: Math.floor(Math.random() * 50000) + 20000,
            conversionRate: (Math.random() * 5 + 2).toFixed(1)
        };
        
        document.getElementById('total-sales').textContent = `$${sales.totalSales.toLocaleString()}`;
        document.getElementById('monthly-revenue').textContent = `$${sales.monthlyRevenue.toLocaleString()}`;
        document.getElementById('conversion-rate').textContent = `${sales.conversionRate}%`;
        
        // Update dashboard overview
        const overviewRevenue = document.getElementById('overview-revenue');
        if (overviewRevenue) {
            overviewRevenue.textContent = `$${sales.monthlyRevenue.toLocaleString()}`;
        }
    } catch (error) {
        console.error('Error getting sales data:', error);
    }
}

// Get order statistics
async function getOrderStats() {
    try {
        // Simulate order data - replace with real API calls
        const orders = {
            pending: Math.floor(Math.random() * 20) + 5,
            processing: Math.floor(Math.random() * 15) + 3,
            completed: Math.floor(Math.random() * 100) + 50
        };
        
        document.getElementById('pending-orders').textContent = orders.pending;
        document.getElementById('processing-orders').textContent = orders.processing;
        document.getElementById('completed-orders').textContent = orders.completed;
        
        // Update dashboard overview
        const overviewOrders = document.getElementById('overview-orders');
        if (overviewOrders) {
            overviewOrders.textContent = orders.pending + orders.processing;
        }
    } catch (error) {
        console.error('Error getting order stats:', error);
    }
}

// Get user activity data
async function getUserActivity() {
    try {
        // Simulate user activity data - replace with real API calls
        const activity = {
            newUsersToday: Math.floor(Math.random() * 50) + 10,
            returningUsers: Math.floor(Math.random() * 200) + 100,
            engagement: (Math.random() * 30 + 60).toFixed(1)
        };
        
        document.getElementById('new-users-today').textContent = activity.newUsersToday;
        document.getElementById('returning-users').textContent = activity.returningUsers;
        document.getElementById('user-engagement').textContent = `${activity.engagement}%`;
    } catch (error) {
        console.error('Error getting user activity:', error);
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        // Simulate recent orders - replace with real API calls
        const orders = [
            { id: 'X004', client: 'Tech Startup', amount: 8000, status: 'pending', time: '1 hour ago' },
            { id: 'X005', client: 'Digital Agency', amount: 15000, status: 'processing', time: '3 hours ago' },
            { id: 'X006', client: 'E-commerce Co', amount: 22000, status: 'completed', time: '6 hours ago' }
        ];
        
        const container = document.getElementById('recent-orders');
        const existingItems = container.querySelectorAll('.activity-item');
        
        orders.forEach(order => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-info">
                    <span class="activity-title">Order #${order.id} - ${order.client}</span>
                    <span class="activity-meta">${order.client} • $${order.amount.toLocaleString()} • ${order.time}</span>
                </div>
                <span class="activity-status ${order.status}">${order.status}</span>
            `;
            
            // Insert at the beginning
            container.insertBefore(item, existingItems[0]);
        });
        
        // Keep only the latest 10 items
        const allItems = container.querySelectorAll('.activity-item');
        if (allItems.length > 10) {
            for (let i = 10; i < allItems.length; i++) {
                allItems[i].remove();
            }
        }
    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

// Load recent submissions
async function loadRecentSubmissions() {
    try {
        // Simulate recent submissions - replace with real API calls
        const submissions = [
            { type: 'Contact Form', email: 'info@newcompany.com', time: '45 minutes ago', status: 'new' },
            { type: 'Resume Submission', email: 'developer@freelance.com', time: '2 hours ago', status: 'new' },
            { type: 'Project Inquiry', email: 'ceo@startup.io', time: '4 hours ago', status: 'reviewed' }
        ];
        
        const container = document.getElementById('recent-submissions');
        const existingItems = container.querySelectorAll('.activity-item');
        
        submissions.forEach(submission => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-info">
                    <span class="activity-title">${submission.type}</span>
                    <span class="activity-meta">${submission.email} • ${submission.time}</span>
                </div>
                <span class="activity-status ${submission.status}">${submission.status}</span>
            `;
            
            // Insert at the beginning
            container.insertBefore(item, existingItems[0]);
        });
        
        // Keep only the latest 10 items
        const allItems = container.querySelectorAll('.activity-item');
        if (allItems.length > 10) {
            for (let i = 10; i < allItems.length; i++) {
                allItems[i].remove();
            }
        }
    } catch (error) {
        console.error('Error loading recent submissions:', error);
    }
}

// Refresh all data
async function refreshData() {
    await checkHealth();
    await getStats();
    await getAnalytics();
    await getSalesData();
    await getOrderStats();
    await getUserActivity();
    
    // Update dashboard overview health
    const overviewHealth = document.getElementById('overview-health');
    if (overviewHealth) {
        overviewHealth.textContent = 'Healthy';
    }
}

// Global functions for backward compatibility
window.checkHealth = checkHealth;
window.getStats = getStats;
window.getAnalytics = getAnalytics;
window.getSalesData = getSalesData;
window.getOrderStats = getOrderStats;
window.getUserActivity = getUserActivity;
window.loadRecentOrders = loadRecentOrders;
window.loadRecentSubmissions = loadRecentSubmissions;
window.refreshData = refreshData;
