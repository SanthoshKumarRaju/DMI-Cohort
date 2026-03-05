// scripts/script.js

// Navigation toggle
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

// Command category tabs
const categoryButtons = document.querySelectorAll('.category-btn');
const commandCategories = document.querySelectorAll('.command-category');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show selected category
        commandCategories.forEach(cat => {
            cat.classList.remove('active');
            if (cat.id === `${category}-category`) {
                cat.classList.add('active');
            }
        });
    });
});

// Copy command functionality
function copyCommand(command) {
    navigator.clipboard.writeText(command).then(() => {
        alert(`Copied to clipboard: ${command}`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to section function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature, .reason-card, .command-item, .step');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for animation
document.querySelectorAll('.feature, .reason-card, .command-item, .step').forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);
// Initial check on page load
window.addEventListener('load', animateOnScroll);