// Enhanced Portfolio JavaScript with Advanced Features

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Initialize all portfolio features
function initializePortfolio() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initFloatingElements();
    initTypewriter();
    initParallax();
    initThemeTransitions();
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger bars
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for grid items
                if (entry.target.classList.contains('projects-grid') || 
                    entry.target.classList.contains('skills-grid') ||
                    entry.target.classList.contains('achievements-grid') ||
                    entry.target.classList.contains('certifications-grid') ||
                    entry.target.classList.contains('internships-grid') ||
                    entry.target.classList.contains('education-grid')) {
                    
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `fadeInUp 0.6s ease forwards`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.section-title, .about-text, .contact-info, .projects-grid, .skills-grid, ' +
        '.achievements-grid, .certifications-grid, .internships-grid, .education-grid, ' +
        '.contact-form, .hero-content'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-in');
        observer.observe(el);
    });
}

// Advanced animations
function initAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Mouse follow effect for glass cards
    const glassCards = document.querySelectorAll('.glass-card, .project-card, .skill-category, .achievement-card, .certification-card, .internship-card, .education-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Text reveal animation for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.classList.add('letter-reveal');
            title.appendChild(span);
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!validateForm(formData)) {
                showNotification('Please fill in all fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            try {
                await simulateFormSubmission(formData);
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return data.name.trim() !== '' && 
           emailRegex.test(data.email) && 
           data.message.trim() !== '' && 
           data.message.trim().length >= 10;
}

// Simulate form submission
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Floating elements animation
function initFloatingElements() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    document.body.appendChild(floatingContainer);
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createFloatingElement(floatingContainer);
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (floatingContainer.children.length < 20) {
            createFloatingElement(floatingContainer);
        }
    }, 2000);
}

function createFloatingElement(container) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    
    // Random positioning and timing
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (Math.random() * 10 + 15) + 's';
    element.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(element);
    
    // Remove element after animation
    setTimeout(() => {
        if (element.parentNode === container) {
            container.removeChild(element);
        }
    }, 25000);
}

// Typewriter effect for hero subtitle
function initTypewriter() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        const roles = ['DevOps Engineer', 'AI Specialist', 'Full Stack Developer', 'Cloud Architect'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        subtitle.textContent = '';
        
        function typeWriter() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                subtitle.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                subtitle.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentRole.length) {
                speed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 500; // Pause before next word
            }
            
            setTimeout(typeWriter, speed);
        }
        
        // Start typewriter effect after page load
        setTimeout(typeWriter, 1000);
    }
}

// Parallax scrolling effects
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for section backgrounds
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            const speed = 0.5 + (index * 0.1);
            section.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });
}

// Theme transition effects
function initThemeTransitions() {
    // Add smooth transitions for theme changes
    const style = document.createElement('style');
    style.textContent = `
        .letter-reveal {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            animation: letterReveal 0.6s ease forwards;
        }
        
        @keyframes letterReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// Mouse cursor effect
document.addEventListener('mousemove', (e) => {
    // Create cursor trail effect
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
});

// Add cursor trail styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, rgba(79, 172, 254, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 1s ease-out forwards;
    }
    
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(cursorStyle);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Your scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading for images (if any)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
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

// Initialize lazy loading
initLazyLoading();

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading class after animations
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could show user-friendly error message
});

// Feature detection and fallbacks
if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    console.warn('IntersectionObserver not supported');
    // Implement fallback scroll detection
}

// Console easter egg
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    PUTLA VENKATESH                           ║
║                 DevOps & AI Engineer                         ║
║                                                              ║
║  Thanks for checking out my portfolio!                       ║
║  Feel free to reach out: 21jr1a43h8@gmail.com              ║
║                                                              ║
║  Built with ❤️ using vanilla JavaScript                      ║
╚══════════════════════════════════════════════════════════════╝
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showNotification,
        debounce
    };
}
