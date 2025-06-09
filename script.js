// Enhanced Portfolio JavaScript with Advanced Features and Performance Optimizations

// Core Application State
const PortfolioApp = {
    isLoaded: false,
    activeSection: 'home',
    scrollDirection: 'down',
    lastScrollTop: 0,
    animations: new Map(),
    observers: new Map(),
    eventListeners: new Map()
};

// Utility Functions
const Utils = {
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    isElementInViewport(el, threshold = 0.1) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth * (1 - threshold) &&
            rect.right >= windowWidth * threshold
        );
    },

    preloadImages(urls) {
        return Promise.all(urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        }));
    }
};

// Advanced Animation Engine
class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.isRunning = false;
        this.frameId = null;
    }

    add(id, animation) {
        this.animations.set(id, {
            ...animation,
            startTime: performance.now(),
            isActive: true
        });
        
        if (!this.isRunning) {
            this.start();
        }
    }

    remove(id) {
        this.animations.delete(id);
        if (this.animations.size === 0) {
            this.stop();
        }
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }

    animate() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        
        this.animations.forEach((animation, id) => {
            if (!animation.isActive) return;

            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            const easedProgress = animation.easing ? 
                this.applyEasing(progress, animation.easing) : progress;
            
            animation.update(easedProgress);
            
            if (progress >= 1) {
                if (animation.onComplete) animation.onComplete();
                if (animation.loop) {
                    animation.startTime = currentTime;
                } else {
                    this.remove(id);
                }
            }
        });

        this.frameId = requestAnimationFrame(() => this.animate());
    }

    applyEasing(t, type) {
        const easings = {
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInElastic: t => {
                if (t === 0 || t === 1) return t;
                const p = 0.3;
                const s = p / 4;
                return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
            },
            easeOutElastic: t => {
                if (t === 0 || t === 1) return t;
                const p = 0.3;
                const s = p / 4;
                return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
            }
        };
        
        return easings[type] ? easings[type](t) : t;
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0
        };
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isMonitoring = false;
    }

    start() {
        this.isMonitoring = true;
        this.monitor();
    }

    stop() {
        this.isMonitoring = false;
    }

    monitor() {
        if (!this.isMonitoring) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        this.frameCount++;
        this.metrics.frameTime = deltaTime;
        
        if (this.frameCount % 60 === 0) {
            this.metrics.fps = Math.round(1000 / (deltaTime / 60));
            
            if (performance.memory) {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
            }
            
            this.onMetricsUpdate?.(this.metrics);
        }

        this.lastTime = currentTime;
        requestAnimationFrame(() => this.monitor());
    }
}

// Advanced Particle System
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: 50,
            speed: { min: 0.5, max: 2 },
            size: { min: 2, max: 6 },
            color: 'rgba(102, 126, 234, 0.3)',
            direction: 'up',
            respawn: true,
            ...options
        };
        this.animationEngine = new AnimationEngine();
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = Utils.createElement('div', 'particle');
        const size = Utils.getRandomFloat(this.options.size.min, this.options.size.max);
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${this.options.color};
            border-radius: 50%;
            pointer-events: none;
            left: ${Utils.getRandomFloat(0, 100)}%;
            top: 100%;
            opacity: 0;
        `;

        this.container.appendChild(particle);
        
        const particleData = {
            element: particle,
            speed: Utils.getRandomFloat(this.options.speed.min, this.options.speed.max),
            size: size,
            opacity: Utils.getRandomFloat(0.3, 0.8),
            life: 0
        };

        this.particles.push(particleData);
        this.animateParticle(particleData);
    }

    animateParticle(particle) {
        const duration = Utils.getRandomInt(15000, 25000);
        
        this.animationEngine.add(`particle-${Date.now()}-${Math.random()}`, {
            duration: duration,
            easing: 'easeOutQuad',
            update: (progress) => {
                const y = 100 - (progress * 120);
                const opacity = progress < 0.1 ? progress * 10 : 
                               progress > 0.9 ? (1 - progress) * 10 : 1;
                
                particle.element.style.transform = `translateY(${y}vh) translateX(${Math.sin(progress * Math.PI * 2) * 20}px)`;
                particle.element.style.opacity = opacity * particle.opacity;
            },
            onComplete: () => {
                if (this.options.respawn) {
                    particle.element.style.left = Utils.getRandomFloat(0, 100) + '%';
                    this.animateParticle(particle);
                } else {
                    particle.element.remove();
                    this.particles = this.particles.filter(p => p !== particle);
                }
            }
        });
    }

    destroy() {
        this.particles.forEach(particle => particle.element.remove());
        this.particles = [];
        this.animationEngine.stop();
    }
}

// Enhanced Typewriter Effect
class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            strings: ['Developer', 'Designer', 'Creator'],
            speed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            ...options
        };
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.init();
    }

    init() {
        if (this.options.showCursor) {
            this.element.style.position = 'relative';
            this.addCursor();
        }
        this.type();
    }

    addCursor() {
        const cursor = Utils.createElement('span', 'typewriter-cursor', this.options.cursorChar);
        cursor.style.cssText = `
            animation: blink 1s infinite;
            margin-left: 2px;
        `;
        this.element.appendChild(cursor);
    }

    type() {
        if (this.isPaused) return;

        const currentString = this.options.strings[this.currentStringIndex];
        
        if (this.isDeleting) {
            this.element.firstChild.textContent = currentString.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.firstChild.textContent = currentString.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let speed = this.isDeleting ? this.options.deleteSpeed : this.options.speed;

        if (!this.isDeleting && this.currentCharIndex === currentString.length) {
            speed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentStringIndex = (this.currentStringIndex + 1) % this.options.strings.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.type();
    }

    destroy() {
        this.pause();
        if (this.element.querySelector('.typewriter-cursor')) {
            this.element.querySelector('.typewriter-cursor').remove();
        }
    }
}

// Advanced Scroll Handler
class ScrollHandler {
    constructor() {
        this.callbacks = new Map();
        this.isScrolling = false;
        this.scrollTop = 0;
        this.direction = 'down';
        this.init();
    }

    init() {
        const throttledScrollHandler = Utils.throttle((e) => {
            this.handleScroll(e);
        }, 16);

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    }

    handleScroll(e) {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.direction = currentScrollTop > this.scrollTop ? 'down' : 'up';
        this.scrollTop = currentScrollTop;

        if (!this.isScrolling) {
            this.isScrolling = true;
            requestAnimationFrame(() => {
                this.executeCallbacks();
                this.isScrolling = false;
            });
        }
    }

    executeCallbacks() {
        this.callbacks.forEach((callback) => {
            callback({
                scrollTop: this.scrollTop,
                direction: this.direction,
                progress: this.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)
            });
        });
    }

    on(id, callback) {
        this.callbacks.set(id, callback);
    }

    off(id) {
        this.callbacks.delete(id);
    }
}

// Enhanced Intersection Observer Manager
class IntersectionManager {
    constructor() {
        this.observers = new Map();
    }

    observe(elements, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => callback(entry));
        }, defaultOptions);

        const observerId = `observer_${Date.now()}_${Math.random()}`;
        this.observers.set(observerId, observer);

        if (Array.isArray(elements)) {
            elements.forEach(el => observer.observe(el));
        } else {
            observer.observe(elements);
        }

        return observerId;
    }

    unobserve(observerId) {
        const observer = this.observers.get(observerId);
        if (observer) {
            observer.disconnect();
            this.observers.delete(observerId);
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Advanced Form Handler
class FormHandler {
    constructor(form, options = {}) {
        this.form = form;
        this.options = {
            validateOnInput: true,
            showErrors: true,
            submitEndpoint: null,
            onSuccess: null,
            onError: null,
            ...options
        };
        this.validators = new Map();
        this.errors = new Map();
        this.init();
    }

    init() {
        this.setupValidators();
        this.bindEvents();
    }

    setupValidators() {
        this.addValidator('email', (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) || 'Please enter a valid email address';
        });

        this.addValidator('required', (value) => {
            return value.trim() !== '' || 'This field is required';
        });

        this.addValidator('minLength', (value, min) => {
            return value.length >= min || `Minimum ${min} characters required`;
        });

        this.addValidator('maxLength', (value, max) => {
            return value.length <= max || `Maximum ${max} characters allowed`;
        });
    }

    addValidator(name, validator) {
        this.validators.set(name, validator);
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        if (this.options.validateOnInput) {
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', Utils.debounce(() => {
                    this.validateField(input);
                }, 300));

                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }
    }

    validateField(field) {
        const rules = field.dataset.validate ? field.dataset.validate.split('|') : [];
        const errors = [];

        rules.forEach(rule => {
            const [ruleName, ruleParam] = rule.split(':');
            const validator = this.validators.get(ruleName);
            
            if (validator) {
                const result = validator(field.value, ruleParam);
                if (result !== true) {
                    errors.push(result);
                }
            }
        });

        if (errors.length > 0) {
            this.errors.set(field.name, errors);
            this.showFieldError(field, errors[0]);
        } else {
            this.errors.delete(field.name);
            this.clearFieldError(field);
        }

        return errors.length === 0;
    }

    showFieldError(field, message) {
        if (!this.options.showErrors) return;

        this.clearFieldError(field);
        
        const errorElement = Utils.createElement('div', 'field-error', message);
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;

        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    validateAll() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateAll()) {
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            if (this.options.submitEndpoint) {
                const response = await fetch(this.options.submitEndpoint, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                this.options.onSuccess?.(result);
            } else {
                // Simulate submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.options.onSuccess?.(data);
            }

            this.form.reset();
            this.errors.clear();
        } catch (error) {
            this.options.onError?.(error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
}

// Notification System
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
    }

    createContainer() {
        const container = Utils.createElement('div', 'notification-container');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const id = `notification_${Date.now()}_${Math.random()}`;
        const notification = this.createNotification(message, type);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto remove
        setTimeout(() => {
            this.hide(id);
        }, duration);

        return id;
    }

    createNotification(message, type) {
        const notification = Utils.createElement('div', `notification notification-${type}`);
        
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20c997)',
            error: 'linear-gradient(135deg, #dc3545, #c82333)',
            warning: 'linear-gradient(135deg, #ffc107, #fd7e14)',
            info: 'linear-gradient(135deg, #667eea, #764ba2)'
        };

        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
            cursor: pointer;
            max-width: 300px;
            word-wrap: break-word;
        `;

        notification.textContent = message;
        
        notification.addEventListener('click', () => {
            const id = Array.from(this.notifications.entries())
                .find(([key, value]) => value === notification)?.[0];
            if (id) this.hide(id);
        });

        return notification;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(id);
            }, 400);
        }
    }

    clear() {
        this.notifications.forEach((notification, id) => {
            this.hide(id);
        });
    }
}

// Main Portfolio Controller
class PortfolioController {
    constructor() {
        this.animationEngine = new AnimationEngine();
        this.scrollHandler = new ScrollHandler();
        this.intersectionManager = new IntersectionManager();
        this.notificationSystem = new NotificationSystem();
        this.performanceMonitor = new PerformanceMonitor();
        this.particleSystem = null;
        this.typewriter = null;
        
        this.init();
    }

    init() {
        this.waitForDOMLoad().then(() => {
            this.initializeComponents();
            this.bindEvents();
            this.startAnimations();
            this.logWelcome();
        });
    }

    waitForDOMLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    initializeComponents() {
        this.initNavigation();
        this.initHeroSection();
        this.initScrollAnimations();
        this.initContactForm();
        this.initParticleSystem();
        this.initPerformanceMonitoring();
    }

    initNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
                this.animateHamburger(hamburger);
            });

            // Close menu when clicking nav items
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    this.resetHamburger(hamburger);
                });
            });
        }

        // Enhanced scroll-based navbar
        this.scrollHandler.on('navbar', ({ scrollTop, direction }) => {
            if (navbar) {
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Auto-hide on scroll down
                if (direction === 'down' && scrollTop > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
        });

        // Active section highlighting
        this.initSectionTracking();
    }

    initSectionTracking() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        this.intersectionManager.observe(sections, (entry) => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }, { threshold: 0.3 });
    }

    initHeroSection() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (heroSubtitle) {
            // Clear existing content
            heroSubtitle.innerHTML = '<span></span>';
            
            this.typewriter = new TypewriterEffect(heroSubtitle, {
                strings: ['DevOps Engineer', 'AI Specialist', 'Cloud Architect', 'Full Stack Developer'],
                speed: 80,
                deleteSpeed: 40,
                pauseTime: 2000
            });
        }

        // Hero parallax effect
        this.scrollHandler.on('hero-parallax', ({ scrollTop }) => {
            const hero = document.querySelector('.hero-content');
            if (hero) {
                const parallaxSpeed = 0.5;
                hero.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
            }
        });

        // Profile image hover effect
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            profileImage.addEventListener('mouseenter', () => {
                this.animationEngine.add('profile-hover', {
                    duration: 300,
                    easing: 'easeOutElastic',
                    update: (progress) => {
                        const scale = 1 + (progress * 0.1);
                        profileImage.style.transform = `scale(${scale})`;
                    }
                });
            });

            profileImage.addEventListener('mouseleave', () => {
                this.animationEngine.add('profile-reset', {
                    duration: 300,
                    easing: 'easeOutQuad',
                    update: (progress) => {
                        const scale = 1.1 - (progress * 0.1);
                        profileImage.style.transform = `scale(${scale})`;
                    }
                });
            });
        }
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.section-title, .project-card, .skill-category, .achievement-card, ' +
            '.certification-card, .internship-card, .education-card'
        );

        animatedElements.forEach((element, index) => {
            this.intersectionManager.observe(element, (entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    }, index * 100);
                }
            });
        });

        // Advanced card hover effects
        document.querySelectorAll('.project-card, .skill-category, .achievement-card, .certification-card, .internship-card, .education-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addCardHoverEffect(e.currentTarget);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeCardHoverEffect(e.currentTarget);
            });
        });
    }

    addCardHoverEffect(card) {
        this.animationEngine.add(`card-hover-${card.id || Math.random()}`, {
            duration: 300,
            easing: 'easeOutCubic',
            update: (progress) => {
                const translateY = -10 * progress;
                const scale = 1 + (0.02 * progress);
                card.style.transform = `translateY(${translateY}px) scale(${scale})`;
                card.style.boxShadow = `0 ${20 + (30 * progress)}px ${50 + (20 * progress)}px rgba(0, 0, 0, ${0.15 + (0.1 * progress)})`;
            }
        });
    }

    removeCardHoverEffect(card) {
        this.animationEngine.add(`card-reset-${card.id || Math.random()}`, {
            duration: 300,
            easing: 'easeOutCubic',
            update: (progress) => {
                const translateY = -10 + (10 * progress);
                const scale = 1.02 - (0.02 * progress);
                card.style.transform = `translateY(${translateY}px) scale(${scale})`;
                card.style.boxShadow = `0 ${50 - (30 * progress)}px ${70 - (20 * progress)}px rgba(0, 0, 0, ${0.25 - (0.1 * progress)})`;
            }
        });
    }

    initContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            this.formHandler = new FormHandler(form, {
                validateOnInput: true,
                showErrors: true,
                submitEndpoint: '/api/contact',
                onSuccess: (data) => {
                    this.notificationSystem.show('Message sent successfully!', 'success');
                    form.reset();
                },
                onError: (error) => {
                    this.notificationSystem.show('Failed to send message. Please try again.', 'error');
                    console.error('Form submission error:', error);
                }
            });
        }
    }

    initParticleSystem() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            this.particleSystem = new ParticleSystem(heroSection, {
                count: 60,
                speed: { min: 0.3, max: 1.5 },
                size: { min: 1, max: 4 },
                color: 'rgba(102, 126, 234, 0.2)',
                direction: 'up',
                respawn: true
            });
        }
    }

    initPerformanceMonitoring() {
        this.performanceMonitor.onMetricsUpdate = (metrics) => {
            if (metrics.fps < 30) {
                // Optimize by reducing particle count
                if (this.particleSystem?.particles.length > 30) {
                    this.particleSystem.particles.splice(30).forEach(p => p.element.remove());
                    this.particleSystem.options.count = 30;
                }
            }
        };
        this.performanceMonitor.start();
    }

    animateHamburger(hamburger) {
        this.animationEngine.add('hamburger', {
            duration: 300,
            easing: 'easeOutQuad',
            update: (progress) => {
                const rotate = progress * 45;
                const translateY = progress * 5;
                const spans = hamburger.querySelectorAll('span');
                
                spans[0].style.transform = `rotate(${rotate}deg) translate(${translateY}px, ${translateY}px)`;
                spans[1].style.opacity = 1 - progress;
                spans[2].style.transform = `rotate(-${rotate}deg) translate(${translateY}px, -${translateY}px)`;
            }
        });
    }

    resetHamburger(hamburger) {
        this.animationEngine.add('hamburger-reset', {
            duration: 300,
            easing: 'easeOutQuad',
            update: (progress) => {
                const rotate = 45 - (progress * 45);
                const translateY = 5 - (progress * 5);
                const spans = hamburger.querySelectorAll('span');
                
                spans[0].style.transform = `rotate(${rotate}deg) translate(${translateY}px, ${translateY}px)`;
                spans[1].style.opacity = progress;
                spans[2].style.transform = `rotate(-${rotate}deg) translate(${translateY}px, -${translateY}px)`;
            }
        });
    }

    startAnimations() {
        // Preload critical assets
        const imageUrls = [
            '/images/profile.jpg',
            '/images/projects/project1.jpg',
            '/images/projects/project2.jpg'
            // Add more image URLs as needed
        ];

        Utils.preloadImages(imageUrls)
            .then(() => {
                console.log('Images preloaded successfully');
                this.notificationSystem.show('Portfolio loaded successfully', 'success', 3000);
            })
            .catch(error => {
                console.error('Image preload failed:', error);
                this.notificationSystem.show('Some assets failed to load', 'warning', 3000);
            });

        // Start hero section animations
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            this.animationEngine.add(`hero-${index}`, {
                duration: 800,
                easing: 'easeOutCubic',
                update: (progress) => {
                    element.style.opacity = progress;
                    element.style.transform = `translateY(${100 - (progress * 100)}px)`;
                },
                delay: index * 200
            });
        });
    }

    bindEvents() {
        // Window resize handler
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 100));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navLinks = document.getElementById('nav-links');
                const hamburger = document.getElementById('hamburger');
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    this.resetHamburger(hamburger);
                }
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleResize() {
        // Update particle system
        if (this.particleSystem) {
            const heroSection = document.querySelector('.hero-section');
            this.particleSystem.particles.forEach(particle => {
                particle.element.style.left = `${Utils.getRandomFloat(0, heroSection.offsetWidth)}px`;
            });
        }

        // Update responsive layouts
        this.updateResponsiveLayouts();
    }

    updateResponsiveLayouts() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const width = window.innerWidth;
            const columns = width > 1200 ? 3 : width > 768 ? 2 : 1;
            projectsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
    }

    logWelcome() {
        console.log('%cWelcome to my Portfolio!', 'color: #667eea; font-size: 24px; font-weight: bold;');
        console.log('%cBuilt with modern JavaScript and performance in mind', 'color: #764ba2; font-size: 16px;');
        console.log('%cCheck out the source code at github.com/yourusername/portfolio', 'color: #20c997; font-size: 14px;');
    }

    destroy() {
        // Cleanup all resources
        this.animationEngine.stop();
        this.particleSystem?.destroy();
        this.typewriter?.destroy();
        this.intersectionManager.destroy();
        this.performanceMonitor.stop();
        this.notificationSystem.clear();
        
        // Remove event listeners
        this.scrollHandler.callbacks.clear();
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.scrollHandler.handleScroll);
    }
}

// Initialize Portfolio
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioController();
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        portfolio.destroy();
    });
});

// CSS Animations (should be in a separate CSS file)
const styles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

.notification-container {
    transition: all 0.3s ease;
}

.notification {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.particle {
    will-change: transform, opacity;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.nav-links.active {
    display: flex;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
    }
}

.field-error {
    animation: fadeInUp 0.3s ease;
}

.hamburger span {
    display: block;
    width: 25px;
    height: 3px;
    background: #333;
    margin: 5px 0;
    transition: all 0.3s ease;
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.projects-grid {
    display: grid;
    gap: 2rem;
    transition: all 0.3s ease;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Export for module usage
export {
    PortfolioController,
    AnimationEngine,
    ParticleSystem,
    TypewriterEffect,
    ScrollHandler,
    IntersectionManager,
    FormHandler,
    NotificationSystem,
    PerformanceMonitor,
    Utils
};
