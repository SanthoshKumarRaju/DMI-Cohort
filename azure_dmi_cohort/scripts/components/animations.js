// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }
    
    // Parallax effect for hero section
    initParallax();
    
    // Typing animation for hero title (if needed)
    initTypingAnimation();
}

// Parallax effect
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }, 10));
    }
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle && !sessionStorage.getItem('typingAnimationPlayed')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--white)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                heroTitle.style.borderRight = 'none';
                sessionStorage.setItem('typingAnimationPlayed', 'true');
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }
}

// Cloud animation for hero section
function initCloudAnimation() {
    const clouds = document.querySelectorAll('.cloud-layer');
    
    clouds.forEach((cloud, index) => {
        cloud.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCloudAnimation();
});

// Export animation functions
window.animations = {
    initAnimations,
    initParallax,
    initTypingAnimation,
    initCloudAnimation
};