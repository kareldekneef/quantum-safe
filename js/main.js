/* ===================================
   Quantum-Safe Readiness Microsite
   Main JavaScript
   =================================== */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize Shor slider if present
    initShorSlider();

    // Animate elements on scroll
    initScrollAnimations();
});

// Shor's Algorithm Slider
function initShorSlider() {
    const slider = document.getElementById('shor-slider');
    const timeValue = document.querySelector('.time-value');
    const timeUnit = document.querySelector('.time-unit');
    const resultContext = document.getElementById('result-context');

    if (!slider) return;

    const scenarios = [
        { value: 0, time: '300 trillion', unit: 'years', context: 'Time to break RSA-2048 with 10,000 classical cores' },
        { value: 25, time: '30 trillion', unit: 'years', context: 'Time to break RSA-2048 with 100,000 classical cores' },
        { value: 50, time: '3 trillion', unit: 'years', context: 'Time to break RSA-2048 with 1 million classical cores' },
        { value: 75, time: '~10', unit: 'years', context: 'Estimated time with 100 error-corrected logical qubits' },
        { value: 100, time: '~10', unit: 'hours', context: 'Estimated time with 4,000 error-corrected logical qubits running Shor\'s algorithm' }
    ];

    slider.addEventListener('input', function() {
        const value = parseInt(this.value);
        let scenario = scenarios[0];

        for (let i = scenarios.length - 1; i >= 0; i--) {
            if (value >= scenarios[i].value) {
                scenario = scenarios[i];
                break;
            }
        }

        timeValue.textContent = scenario.time;
        timeUnit.textContent = scenario.unit;
        resultContext.textContent = scenario.context;

        // Update visual feedback
        const isQuantum = value >= 75;
        const resultDisplay = document.querySelector('.shor-result');
        if (resultDisplay) {
            resultDisplay.style.borderColor = isQuantum ? 'var(--color-accent)' : 'transparent';
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe timeline steps
    document.querySelectorAll('.timeline-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Observe phase cards
    document.querySelectorAll('.phase').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add animation class
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

// Utility: Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Utility: Debounce function
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
