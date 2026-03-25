// Notification System (Toast)
const showNotification = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-cyber ${type}`;
    toast.style.background = type === 'success' ? 'rgba(0, 212, 255, 0.9)' : 'rgba(233, 69, 96, 0.9)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.3)';
    toast.style.fontFamily = 'Orbitron, sans-serif';
    toast.style.fontSize = '0.9rem';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'transform 0.3s ease';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.2)';

    const icon = type === 'success' ? '<i data-lucide="check-circle" style="width:18px;"></i>' : '<i data-lucide="alert-circle" style="width:18px;"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    document.getElementById('toast-container').appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// Sticky Navbar on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Counter Animation for Stats
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = (count + inc).toFixed(target % 1 === 0 ? 0 : 1);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) observer.observe(statsSection);

// Smooth scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            let targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 20);
            
            // Special case for scrolling to absolute top
            if (targetId === '#top') targetPosition = 0;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                toggler.click();
            }
        }
    });
});

// Newsletter Validation & Submission
const handleNewsletter = (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();
    
    let errorLabel = form.querySelector('.email-error-label');
    if (!errorLabel) {
        errorLabel = document.createElement('label');
        errorLabel.className = 'email-error-label small text-accent w-100 mb-2 mt-n2';
        errorLabel.style.display = 'none';
        input.parentNode.insertBefore(errorLabel, input.nextSibling);
    }

    if (!email || !email.includes('@')) {
        input.style.borderColor = 'rgba(233, 69, 96, 0.8)';
        input.style.boxShadow = '0 0 10px rgba(233, 69, 96, 0.2)';
        errorLabel.innerText = !email ? "Warning: Email address is required." : "Warning: Please enter a valid email address.";
        errorLabel.style.display = 'block';
        return;
    }
    
    // Clear any previous error styling
    input.style.borderColor = '';
    input.style.boxShadow = '';
    errorLabel.style.display = 'none';

    // Mock API call
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:16px;"></i>';
    lucide.createIcons();

    setTimeout(() => {
        showNotification('Subscribed to threat intelligence updates!');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        
        // Immediate redirect as requested by user
        window.location.href = '404.html';
    }, 1000);
};

document.querySelectorAll('.newsletter form').forEach(form => {
    form.setAttribute('novalidate', 'true');
    form.addEventListener('submit', handleNewsletter);
    const input = form.querySelector('input[type="email"]');
    if (input) {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'rgba(233, 69, 96, 0.5)';
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields identity verification.', 'error');
            return;
        }

        // Mock Submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Encrypting Transmission...';

        setTimeout(() => {
            showNotification('Encrypted request transmitted successfully. Our specialists will contact you shortly.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    });
}
