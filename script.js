// Custom Cursor (Desktop only)
const cursor = document.querySelector('.cursor');
if (cursor && window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .service-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// Detect viewport size and optimize for responsiveness
function isMobile() {
    return window.innerWidth < 768;
}

function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

function isDesktop() {
    return window.innerWidth >= 1024;
}

// Throttle scroll events for better performance
let scrollTimeout;
function throttleScroll(callback, delay = 100) {
    return function() {
        if (!scrollTimeout) {
            callback();
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
            }, delay);
        }
    };
}

// Sticky Header & Active Links
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const updateHeaderAndLinks = throttleScroll(() => {
    // Header Blur Effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active Link Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) && current !== null) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('scroll', updateHeaderAndLinks, { passive: true });

// Scroll Reveal Animations - Optimized for mobile
const revealElements = () => {
    const reveals = document.querySelectorAll(".reveal");
    const elementVisible = isMobile() ? 50 : 100;
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
        }
    });
};

window.addEventListener('scroll', throttleScroll(revealElements, 100), { passive: true });
revealElements(); // Trigger on load

// Smooth scroll for anchor links - optimized for touch
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            // Close mobile menu if it's open
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
                document.body.style.overflow = '';
            }
            
            const headerOffset = isMobile() ? 70 : 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, { passive: true });
});

// Mobile menu toggle - Improved for touch
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinksItems = document.querySelectorAll('.nav-link');

if(mobileBtn) {
    // Prevent double tap zoom on mobile
    mobileBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleMobileMenu();
    }, { passive: false });
    
    mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
    });
}

function toggleMobileMenu() {
    nav.classList.toggle('open');
    const icon = mobileBtn.querySelector('i');
    if (nav.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
        document.body.style.overflow = 'hidden';
        header.style.backgroundColor = 'var(--bg-color)';
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
        header.style.backgroundColor = '';
    }
}

// Close menu when clicking a link or outside
if (navLinksItems) {
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('open')) {
        if (!nav.contains(e.target) && !mobileBtn.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

function closeMobileMenu() {
    if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
        header.style.backgroundColor = '';
    }
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
    closeMobileMenu();
    revealElements();
});

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isDesktop() && nav && nav.classList.contains('open')) {
            closeMobileMenu();
        }
        revealElements();
    }, 250);
});
