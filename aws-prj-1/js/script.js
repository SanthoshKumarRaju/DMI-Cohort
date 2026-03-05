// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Interactive Code Blocks
document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('click', () => {
        const text = block.querySelector('code').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = block.innerHTML;
            block.innerHTML = '<div class="copied-message">Copied to clipboard!</div>' + originalHtml;
            setTimeout(() => {
                block.innerHTML = originalHtml;
            }, 2000);
        });
    });
});

// Step Progress Indicator
const steps = document.querySelectorAll('.step-card');
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.innerHTML = `
    <div class="progress-track"></div>
    <div class="progress-thumb"></div>
`;

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});