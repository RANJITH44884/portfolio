// script.js - Updated with EmailJS functionality

// ==================== EMAILJS INITIALIZATION ====================
// Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = "Jr3BfwbvHNSEA74a8";     // Get from EmailJS Account → API Keys
const EMAILJS_SERVICE_ID = "service_4y23aek";     // Get from Email Services
const EMAILJS_TEMPLATE_ID = "template_gz4tnf5";   // Get from Email Templates

// Load EmailJS library dynamically (or add script tag in HTML)
// We'll add the script tag in the HTML instead

// ==================== EXISTING CODE (Particles, Theme, etc.) ====================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles(count = 120) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles(100);
});

resizeCanvas();
initParticles(140);
animateParticles();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') { body.classList.add('dark'); updateThemeIcon(true); }
else if (savedTheme === 'light') { body.classList.remove('dark'); updateThemeIcon(false); }
else { const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; if (prefersDark) { body.classList.add('dark'); updateThemeIcon(true); } else updateThemeIcon(false); }

function updateThemeIcon(isDark) { 
    const icon = themeToggle.querySelector('i'); 
    if (isDark) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); } 
    else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); } 
}

themeToggle.addEventListener('click', () => { 
    if (body.classList.contains('dark')) { 
        body.classList.remove('dark'); 
        localStorage.setItem('theme', 'light'); 
        updateThemeIcon(false); 
    } else { 
        body.classList.add('dark'); 
        localStorage.setItem('theme', 'dark'); 
        updateThemeIcon(true); 
    } 
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));
}

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) { 
        e.preventDefault(); 
        const target = document.querySelector(this.getAttribute('href')); 
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    });
});

// ==================== EMAILJS CONTACT FORM HANDLER ====================
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

if (contactForm) {
    contactForm.addEventListener('submit', (e) => { 
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value,
            to_email: "ranjith.c@example.com" // Change to your email address
        };
        
        // Show loading state on button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Show success toast
                toast.textContent = 'Message sent successfully! 📧';
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.textContent = 'Message sent! I\'ll get back soon.';
                }, 3000);
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                toast.textContent = 'Failed to send message. Please try again.';
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.textContent = 'Message sent! I\'ll get back soon.';
                }, 3000);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// ==================== SCROLL REVEAL OBSERVER ====================
const revealElements = document.querySelectorAll('.skill-card, .project-card, .about-card, .experience-card, .contact-info-card, .contact-form-card');
const observer = new IntersectionObserver((entries) => { 
    entries.forEach(entry => { 
        if (entry.isIntersecting) { 
            entry.target.style.opacity = '1'; 
            entry.target.style.transform = 'translateY(0)'; 
            observer.unobserve(entry.target); 
        } 
    }); 
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(el => { 
    el.style.opacity = '0'; 
    el.style.transform = 'translateY(20px)'; 
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; 
    observer.observe(el); 
});

const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-role, .hero-description, .hero-buttons, .hero-illustration');
heroElements.forEach((el, idx) => { 
    el.style.opacity = '0'; 
    el.style.transform = 'translateY(20px)'; 
    el.style.transition = `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`; 
    observer.observe(el); 
});

// Update copyright year
const year = new Date().getFullYear();
const footerPara = document.querySelector('.footer p');
if (footerPara) footerPara.innerHTML = footerPara.innerHTML.replace('2025', year);