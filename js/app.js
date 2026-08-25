/**
 * ==========================================================================
 * MOUNTAIN MEMOIR — App JavaScript (Phase 1: Hero)
 * High-performance, Vanilla JS interactions & Parallax
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const siteHeader = document.getElementById('siteHeader');
    const heroBg = document.getElementById('heroBg');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // State
    let isMenuOpen = false;
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    /**
     * 1. Navbar Glassmorphic State on Scroll
     */
    const handleScroll = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Toggle scrolled class for navbar blur/solid styling
        if (scrollPosition > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Parallax effect on Hero Background when user scrolls
        if (heroBg) {
            const speed = 0.35; // Parallax translation ratio
            const yOffset = scrollPosition * speed;
            // Apply parallax translateY while preserving subtle scale
            heroBg.style.transform = `scale(1.05) translateY(${yOffset}px)`;
        }

        ticking = false;
    };

    // Passive scroll event listener for 60fps/120fps smoothness
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    /**
     * 2. Subtle Cinematic Mouse Parallax (Desktop Only)
     * Adds an Apple-like depth effect when hovering around the hero section
     */
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && heroBg) {
        window.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            // Calculate normalized offset from center (-1 to 1)
            targetX = (e.clientX / innerWidth - 0.5) * 15; // Max 15px shift
            targetY = (e.clientY / innerHeight - 0.5) * 15;
        });

        // Smooth Interpolation Loop
        const animateMouseParallax = () => {
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            const scrollOffset = (window.pageYOffset || document.documentElement.scrollTop) * 0.35;
            heroBg.style.transform = `scale(1.06) translate(${mouseX}px, ${mouseY + scrollOffset}px)`;

            requestAnimationFrame(animateMouseParallax);
        };

        animateMouseParallax();
    }

    /**
     * 3. Mobile Navigation Drawer Toggle
     */
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            menuToggle.classList.toggle('active', isMenuOpen);
            navLinks.classList.toggle('active', isMenuOpen);
            menuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });

        // Close menu when a navigation link is clicked
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /**
     * 4. Smooth Scroll on Scroll Indicator Click
     */
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(scrollIndicator.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }
});
