// ================== MOBILE NAVBAR TOGGLE ==================
const navbarToggle = document.getElementById('navbarToggle');
const navbar = document.getElementById('navbar');
const navOverlay = document.getElementById('navOverlay');

function toggleNav(open) {
    navbar.classList.toggle('active', open);
    if (navOverlay) navOverlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

if (navbarToggle && navbar) {
    navbarToggle.addEventListener('click', () => toggleNav(!navbar.classList.contains('active')));
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleNav(false));
    });
    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleNav(false));
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) toggleNav(false);
    });
}

// ================== STICKY HEADER ==================
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('sticky', window.scrollY > 60);
});

// ================== ACTIVE NAV LINK ON SCROLL ==================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header nav a[href*="#"]');

function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ================== SCROLL REVEAL (Intersection Observer) ==================
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ================== SMOOTH SCROLL FOR ANCHOR LINKS ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================== PROJECT CARD HOVER (parallax tilt effect) ==================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ================== CONTACT FORM SUBMISSION ==================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        const statusMessage = document.getElementById('statusMessage');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusMessage.className = 'success';
                statusMessage.innerHTML = '<i class="fa-solid fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                setTimeout(() => {
                    contactForm.reset();
                    statusMessage.className = '';
                    statusMessage.innerHTML = '';
                }, 5000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            statusMessage.className = 'error';
            statusMessage.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Something went wrong. Please try again or email me directly.';
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

