// Custom Cursor (Desktop only) - Disabled for performance
// Removed for better performance on all devices

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

// Sticky Header & Active Links - Optimized with caching
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('section[id]');

let lastScrollY = 0;
let isScrolling = false;

const updateHeaderAndLinks = () => {
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
};

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            updateHeaderAndLinks();
            revealElements();
            isScrolling = false;
        });
    }
}, { passive: true });

// Scroll Reveal Animations - Using Intersection Observer for better performance
const revealElements = () => {
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    reveals.forEach(element => {
        observer.observe(element);
    });
};

document.addEventListener('DOMContentLoaded', revealElements);

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
                closeMobileMenu();
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
    const button = mobileBtn;
    if (nav.classList.contains('open')) {
        button.textContent = '✕';
        document.body.style.overflow = 'hidden';
        header.style.backgroundColor = 'var(--bg-color)';
    } else {
        button.textContent = '≡';
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
        mobileBtn.textContent = '≡';
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

// Gallery Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryBtns = document.querySelectorAll('.gallery-btn');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryBtns).map(btn => btn.getAttribute('data-src'));

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
}

// Gallery button events
galleryBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Close lightbox on overlay click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});
