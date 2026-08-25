/**
 * ==========================================================================
 * MOUNTAIN MEMOIR — 3D Parallax & Depth Controller
 * Multi-layer physics, smooth easing interpolation & interactions
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sceneStage = document.getElementById('sceneStage');
    const layerBg = document.getElementById('layerBg');
    const layerBirds = document.getElementById('layerBirds');
    const layerText = document.getElementById('layerText');
    const layerFg = document.getElementById('layerFg');
    const modeToggle = document.getElementById('modeToggle');

    // Physics state
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const ease = 0.055; // Silky smooth interpolation

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    /**
     * 1. Mouse Movement 3D Parallax (Desktop)
     */
    if (!isTouchDevice && sceneStage) {
        window.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            // Center-normalized coordinate (-1 to 1)
            targetX = (e.clientX / innerWidth - 0.5) * 2;
            targetY = (e.clientY / innerHeight - 0.5) * 2;
        });

        const updateParallax = () => {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            // Background Landscape (Deep plane)
            if (layerBg) {
                const bgX = currentX * -10;
                const bgY = currentY * -6;
                layerBg.style.transform = `translate3d(${bgX}px, ${bgY}px, 0)`;
            }

            // Birds (Atmospheric plane)
            if (layerBirds) {
                const birdX = currentX * 20;
                const birdY = currentY * 12;
                layerBirds.style.transform = `translate3d(${birdX}px, ${birdY}px, 0)`;
            }

            // Giant "NATURE" Text (Mid plane)
            if (layerText) {
                const textX = currentX * -5;
                const textY = currentY * -3;
                layerText.style.transform = `translate(-50%, -50%) translate3d(${textX}px, ${textY}px, 0)`;
            }

            // Foreground Ridge (Near plane)
            if (layerFg) {
                const fgX = currentX * 10;
                const fgY = currentY * 6;
                layerFg.style.transform = `translate3d(${fgX}px, ${fgY}px, 0)`;
            }

            requestAnimationFrame(updateParallax);
        };

        updateParallax();
    }

    /**
     * 2. Device Orientation Parallax for Mobile
     */
    if (isTouchDevice && window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                targetX = Math.min(Math.max(e.gamma / 25, -1), 1);
                targetY = Math.min(Math.max((e.beta - 45) / 25, -1), 1);
            }
        });
    }

    /**
     * 3. Mood Switcher Toggle
     */
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            modeToggle.classList.toggle('toggled');
            const active = modeToggle.classList.contains('toggled');

            if (active) {
                if (layerBg) layerBg.style.filter = 'saturate(1.2) contrast(1.08) hue-rotate(-10deg)';
                if (layerFg) layerFg.style.filter = 'saturate(1.2) contrast(1.08) hue-rotate(-10deg)';
            } else {
                if (layerBg) layerBg.style.filter = 'none';
                if (layerFg) layerFg.style.filter = 'none';
            }
        });
    }

    /**
     * 4. Smooth Anchor Feedback
     */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (['#', '#gallery', '#tours', '#contact', '#explore', '#discover'].includes(href)) {
                e.preventDefault();
                link.style.transform = 'scale(0.96)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 140);
            }
        });
    });
});
