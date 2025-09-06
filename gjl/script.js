// Consulting Website JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initNewsletterForm();
    initCookieBanner();
    initScrollAnimations();
    initNavbarScroll();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Newsletter Form Handling
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-signup');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for subscribing! Welcome to our wellness community.', 'success');
            emailInput.value = '';
            
            // In a real application, you would send this data to your server
            console.log('Newsletter subscription:', { email: email, timestamp: new Date() });
        });
    }
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#8B9A8C' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Cookie Consent Banner
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    const cookieSettings = document.getElementById('cookie-settings');
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }
    
    // Accept cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            showNotification('Cookie preferences saved. Thank you!', 'success');
        });
    }
    
    // Decline cookies
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
            showNotification('Cookie preferences saved.', 'info');
        });
    }
    
    // Cookie settings (show banner again)
    if (cookieSettings) {
        cookieSettings.addEventListener('click', function(e) {
            e.preventDefault();
            cookieBanner.classList.add('show');
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-content, .newsletter-content, .appointment-content');
    animateElements.forEach(el => observer.observe(el));
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Service Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Form Enhancement for Better UX
function enhanceFormInputs() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="text"], textarea');
    
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation feedback
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const isValid = isValidEmail(this.value);
                this.style.borderColor = this.value ? (isValid ? '#8B9A8C' : '#e74c3c') : '';
            });
        }
    });
}

// Initialize form enhancements
document.addEventListener('DOMContentLoaded', enhanceFormInputs);

// Appointment Calendar Integration Helper
function initAppointmentCalendar() {
    // This function would integrate with a real calendar service
    // For now, it provides a fallback for the iframe
    
    const calendarContainer = document.querySelector('.calendar-embed');
    const iframe = calendarContainer?.querySelector('iframe');
    
    if (iframe) {
        iframe.addEventListener('load', function() {
            console.log('Calendar loaded successfully');
        });
        
        iframe.addEventListener('error', function() {
            console.log('Calendar failed to load, showing fallback');
            showCalendarFallback();
        });
    }
}

function showCalendarFallback() {
    const calendarContainer = document.querySelector('.calendar-embed');
    if (calendarContainer) {
        calendarContainer.innerHTML = `
            <div class="calendar-fallback">
                <h4>Schedule Your Consultation</h4>
                <p>Our calendar is temporarily unavailable. Please contact us directly to schedule your appointment:</p>
                <div class="contact-options">
                    <a href="mailto:hello@sarahwellness.com" class="btn btn-primary">
                        <i class="fas fa-envelope"></i> Email Us
                    </a>
                    <a href="tel:+15551234567" class="btn btn-outline">
                        <i class="fas fa-phone"></i> Call Us
                    </a>
                </div>
            </div>
        `;
    }
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', initAppointmentCalendar);

// Accessibility Enhancements
function initAccessibility() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Performance Optimization: Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling for External Resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        e.target.style.display = 'none';
    }
});

// Analytics Helper (placeholder for real analytics)
function trackEvent(eventName, eventData = {}) {
    console.log('Analytics Event:', eventName, eventData);
    
    // In a real application, you would send this to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('button_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                form_id: this.id || 'unknown'
            });
        });
    });
});

// Console welcome message
console.log(`
🌿 Welcome to Sarah Wellness Website
Built with care for optimal user experience
For support: hello@sarahwellness.com
`);

// Export functions for potential external use
window.SarahWellness = {
    showNotification,
    trackEvent,
    isValidEmail
};

