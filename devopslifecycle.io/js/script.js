// script.js

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    setupSmoothScrolling();
    setupScrollEffects();
    setupTooltips();
    setupPhaseCardInteractions();
    setupDarkModeToggle();
    setupNewsletterForm();
    setupScrollToTop();
});

// Initialize blog functionality
function initializeBlog() {
    console.log('DevOps Blog initialized successfully');
    
    // Add current year to footer
    const yearElement = document.querySelector('#current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add last modified date
    const lastModifiedElement = document.querySelector('#last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Scroll effects for elements
function setupScrollEffects() {
    const fadeElements = document.querySelectorAll('.phase-card, .tool-item, .benefit-item');
    
    const fadeOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(element);
    });
}

// Tooltips for DevOps tools
function setupTooltips() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Click to learn more about ' + item.querySelector('h3').textContent;
        
        item.appendChild(tooltip);
        
        item.addEventListener('mouseenter', function() {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
        
        item.addEventListener('click', function() {
            const toolName = item.querySelector('h3').textContent;
            alert(`More information about ${toolName} would be displayed here. In a real implementation, this would link to a detailed tool page.`);
        });
    });
}

// Phase card interactions
function setupPhaseCardInteractions() {
    const phaseCards = document.querySelectorAll('.phase-card');
    
    phaseCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName !== 'A') {
                this.classList.toggle('expanded');
                
                if (this.classList.contains('expanded')) {
                    const phaseName = this.querySelector('.phase-header h3').textContent;
                    console.log(`Expanded ${phaseName} phase card`);
                }
            }
        });
    });
}

// Dark mode toggle functionality
function setupDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = 'Toggle Dark Mode';
    
    // Add toggle button to header
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        headerContent.appendChild(darkModeToggle);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
            this.title = 'Switch to Light Mode';
        } else {
            localStorage.setItem('theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            this.title = 'Switch to Dark Mode';
        }
    });
}

// Newsletter form functionality
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate form submission
                this.innerHTML = `
                    <div class="newsletter-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Thank you for subscribing to our DevOps newsletter!</p>
                    </div>
                `;
                
                // In a real implementation, you would send this data to a server
                console.log(`Newsletter subscription: ${email}`);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll to top functionality
function setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.title = 'Scroll to top';
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Phase navigation functionality
function setupPhaseNavigation() {
    const phases = document.querySelectorAll('.phase-card');
    const phaseNav = document.createElement('div');
    phaseNav.className = 'phase-navigation';
    
    let navHTML = '<h3>Jump to Phase:</h3><ul>';
    
    phases.forEach((phase, index) => {
        const phaseName = phase.querySelector('.phase-header h3').textContent;
        navHTML += `<li><a href="#phase-${index + 1}">${index + 1}. ${phaseName}</a></li>`;
        phase.id = `phase-${index + 1}`;
    });
    
    navHTML += '</ul>';
    phaseNav.innerHTML = navHTML;
    
    // Add navigation after intro section
    const introSection = document.querySelector('.intro');
    if (introSection) {
        introSection.parentNode.insertBefore(phaseNav, introSection.nextSibling);
    }
}

// Reading progress indicator
function setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    
    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    
    progressBar.appendChild(progressFill);
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressFill.style.width = scrollPercent + '%';
    });
}

// Initialize additional features when window loads
window.addEventListener('load', function() {
    setupPhaseNavigation();
    setupReadingProgress();
    
    // Add newsletter form if not exists
    if (!document.querySelector('.newsletter-form')) {
        const newsletterSection = document.createElement('section');
        newsletterSection.className = 'newsletter';
        newsletterSection.innerHTML = `
            <div class="container">
                <h2>Stay Updated with DevOps Trends</h2>
                <p>Subscribe to our newsletter for the latest insights and best practices.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Your email address" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(newsletterSection, footer);
        }
        
        setupNewsletterForm();
    }
});

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeBlog,
        setupSmoothScrolling,
        setupScrollEffects,
        setupTooltips,
        validateEmail
    };
}