// X TECH Backend Integration
// Handles form submissions to the backend API

class XTechAPI {
    constructor() {
        // Use localhost:3001 for development, update for production
        this.baseURL = 'http://localhost:3001/api';
    }

    async submitContact(formData) {
        try {
            const response = await fetch(`${this.baseURL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Form submission failed');
            }

            return data;
        } catch (error) {
            console.error('Contact form submission error:', error);
            throw error;
        }
    }

    async submitProject(formData) {
        try {
            // FormData automatically sets the right Content-Type for file uploads
            const response = await fetch(`${this.baseURL}/project`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Project submission failed');
            }

            return data;
        } catch (error) {
            console.error('Project submission error:', error);
            throw error;
        }
    }

    async submitResume(formData) {
        try {
            // FormData automatically sets the right Content-Type for file uploads
            const response = await fetch(`${this.baseURL}/resume`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Resume submission failed');
            }

            return data;
        } catch (error) {
            console.error('Resume submission error:', error);
            throw error;
        }
    }
}

// Initialize API
const xtechAPI = new XTechAPI();

// Form submission handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        // Handle contact form
        const contactForm = document.getElementById('xtech-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // Handle resume form
        const resumeForm = document.getElementById('application-form');
        if (resumeForm) {
            resumeForm.addEventListener('submit', this.handleResumeSubmit.bind(this));
        }

        // Handle project form
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', this.handleProjectSubmit.bind(this));
        }
    }

    async handleContactSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('.contact-submit-btn');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                throw new Error('Please fill in all required fields');
            }
            
            // Submit to backend
            const result = await xtechAPI.submitContact(data);
            
            // Show success message
            this.showMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showMessage('error', error.message || 'Failed to send message. Please try again.');
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    async handleResumeSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('.submit-application');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            // Get form data
            const formData = new FormData(form);
            
            // Validate required fields
            const fullName = formData.get('fullName');
            const email = formData.get('email');
            const position = formData.get('position');
            const resume = formData.get('resume');
            
            if (!fullName || !email || !position || !resume) {
                throw new Error('Please fill in all required fields and upload your resume');
            }
            
            // Submit to backend
            const result = await xtechAPI.submitResume(formData);
            
            // Show success message
            this.showResumeMessage('success', 'Application submitted successfully! We\'ll review your application and contact you soon.');
            
            // Reset form
            form.reset();
            
            // Clear file preview
            const filePreview = document.getElementById('file-preview');
            if (filePreview) {
                filePreview.classList.remove('show');
            }
            
        } catch (error) {
            // Show error message
            this.showResumeMessage('error', error.message || 'Failed to submit application. Please try again.');
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    async handleProjectSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('.project-submit-btn');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            submitButton.classList.add('loading');
            
            // Get form data
            const formData = new FormData(form);
            
            // Validate required fields
            const projectTitle = formData.get('projectTitle');
            const projectType = formData.get('projectType');
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const projectDescription = formData.get('projectDescription');
            
            if (!projectTitle || !projectType || !firstName || !lastName || !email || !projectDescription) {
                throw new Error('Please fill in all required fields');
            }
            
            // Submit to backend
            const result = await xtechAPI.submitProject(formData);
            
            // Show success message
            this.showProjectMessage('success', 'Project proposal submitted successfully! We\'ll review your project and get back to you within 2-3 business days.');
            
            // Reset form
            form.reset();
            
            // Reset file upload state
            const fileContainer = form.querySelector('.file-upload-container');
            if (fileContainer) {
                fileContainer.classList.remove('has-files');
            }
            
        } catch (error) {
            // Show error message
            this.showProjectMessage('error', error.message || 'Failed to submit project proposal. Please try again.');
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
        }
    }

    showMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="message-text">${message}</span>
            </div>
        `;

        // Insert after form
        const form = document.getElementById('xtech-contact-form');
        form.parentNode.insertBefore(messageEl, form.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    showResumeMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-messages .form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="message-text">${message}</span>
            </div>
        `;

        // Insert into form messages container
        const messagesContainer = document.querySelector('.form-messages');
        if (messagesContainer) {
            messagesContainer.appendChild(messageEl);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    showProjectMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.project-form .form-messages .form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="message-text">${message}</span>
            </div>
        `;

        // Insert into form messages container
        const messagesContainer = document.querySelector('.project-form .form-messages');
        if (messagesContainer) {
            messagesContainer.appendChild(messageEl);
        }

        // Auto-remove after 7 seconds for project messages (longer for important info)
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 7000);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

// Export for use in other scripts
window.XTechAPI = XTechAPI;
