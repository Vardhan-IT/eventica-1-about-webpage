/**
 * 3D Animation Effects
 * Implements advanced 3D animations and particle effects similar to the reference site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all 3D animation effects
    initializeParticleBackground();
    initializeScrollAnimations();
    initialize3DButtons();
    initializeWavyBackground();
    initializeHoverEffects();
});

/**
 * Initialize Particle Background
 * Creates an interactive particle network background similar to the reference site
 */
function initializeParticleBackground() {
    // Create canvas for particles if it doesn't exist
    if (!document.getElementById('particles-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Style the canvas
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        // Initialize particles
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 100;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: 'rgba(255, 107, 107, ' + (Math.random() * 0.5 + 0.1) + ')',
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                
                // Move particles
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                
                // Draw connections
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255, 107, 107, ' + (0.2 - distance/500) + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Start animation
        animate();
        
        // Resize handler
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

/**
 * Initialize Scroll Animations
 * Adds 3D animations triggered by scrolling
 */
function initializeScrollAnimations() {
    // Add 3D rotation to elements on scroll
    const elements = document.querySelectorAll('.package-card, .statistic-item, .gallery-3d-item');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top + scrollPosition;
            const scrollDifference = scrollPosition - elementPosition;
            
            if (Math.abs(scrollDifference) < 500) {
                const rotateY = scrollDifference / 50;
                element.style.transform = `perspective(1000px) rotateY(${rotateY}deg)`;
            }
        });
    });
    
    // Add parallax depth effect to sections
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const speed = section.getAttribute('data-speed') || 0.2;
            const yPos = -(scrollPosition * speed);
            section.style.backgroundPositionY = yPos + 'px';
        });
    });
}

/**
 * Initialize 3D Buttons
 * Adds 3D effects to buttons throughout the site
 */
function initialize3DButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add 3D button class
        button.classList.add('btn-3d');
        
        // Add mouse move event for 3D effect
        button.addEventListener('mousemove', function(e) {
            const btnRect = button.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            const angleY = -(e.clientX - btnCenterX) / 10;
            const angleX = (e.clientY - btnCenterY) / 10;
            
            button.style.transform = `perspective(500px) rotateY(${angleY}deg) rotateX(${angleX}deg) translateZ(10px)`;
        });
        
        // Reset transform on mouse leave
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        });
    });
}

/**
 * Initialize Wavy Background
 * Creates an animated wavy background effect for sections
 */
function initializeWavyBackground() {
    // Add wavy background to specific sections
    const targetSections = document.querySelectorAll('.hero, .quote-section, .countdown-section');
    
    targetSections.forEach(section => {
        // Create wave container if it doesn't exist
        if (!section.querySelector('.wave-container')) {
            const waveContainer = document.createElement('div');
            waveContainer.className = 'wave-container';
            
            // Create multiple wave layers
            for (let i = 1; i <= 3; i++) {
                const wave = document.createElement('div');
                wave.className = `wave wave-${i}`;
                waveContainer.appendChild(wave);
            }
            
            // Add to section
            section.appendChild(waveContainer);
        }
    });
}

/**
 * Initialize Hover Effects
 * Adds interactive hover effects to various elements
 */
function initializeHoverEffects() {
    // Add glow effect to headings
    const headings = document.querySelectorAll('h1, h2, h3');
    
    headings.forEach(heading => {
        heading.classList.add('glow-on-hover');
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add tilt effect to images
    const images = document.querySelectorAll('.about-image img, .gallery-3d-front img');
    
    images.forEach(image => {
        image.classList.add('tilt-effect');
        
        image.addEventListener('mousemove', function(e) {
            const imgRect = image.getBoundingClientRect();
            const imgX = e.clientX - imgRect.left;
            const imgY = e.clientY - imgRect.top;
            
            const rotateY = ((imgX / imgRect.width) - 0.5) * 20;
            const rotateX = ((imgY / imgRect.height) - 0.5) * -20;
            
            image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        image.addEventListener('mouseleave', function() {
            image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}