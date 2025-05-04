/**
 * 3D Elements and Advanced Animations
 * Implements 3D transformations and interactive elements similar to the reference site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add 3D-elements.css to the page
    const threeDStylesLink = document.createElement('link');
    threeDStylesLink.rel = 'stylesheet';
    threeDStylesLink.href = '3d-elements.css';
    document.head.appendChild(threeDStylesLink);
    
    // Initialize all 3D elements and animations
    initialize3DCards();
    initializeParallaxEffect();
    initialize3DStatistics();
    initializeTestimonial3DCarousel();
    initializeEventGallery3D();
    initializeCountdownTimer();
    initializeFloatingElements();
});

/**
 * Initialize 3D Card Effects
 * Adds depth and perspective to package cards
 */
function initialize3DCards() {
    const cards = document.querySelectorAll('.package-card');
    
    cards.forEach(card => {
        // Add 3D card class
        card.classList.add('card-3d');
        
        // Create card inner for 3D effect
        const cardContent = card.innerHTML;
        card.innerHTML = `<div class="card-3d-inner">${cardContent}</div>`;
        
        // Add mouse move event for 3D rotation effect
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const angleY = -(e.clientX - cardCenterX) / 10;
            const angleX = (e.clientY - cardCenterY) / 10;
            
            const cardInner = card.querySelector('.card-3d-inner');
            cardInner.style.transform = `rotateY(${angleY}deg) rotateX(${angleX}deg)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            const cardInner = card.querySelector('.card-3d-inner');
            cardInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });
}

/**
 * Initialize Parallax Effect
 * Creates depth with background elements moving at different speeds
 */
function initializeParallaxEffect() {
    // Add parallax container to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create floating elements in the background
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-container';
        
        // Add floating shapes
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
            shape.style.animationDelay = `${Math.random() * 5}s`;
            parallaxContainer.appendChild(shape);
        }
        
        // Insert at the beginning of hero section
        heroSection.insertBefore(parallaxContainer, heroSection.firstChild);
    }
    
    // Add scroll event for parallax effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax for hero section
        if (heroSection) {
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
        
        // Parallax for other sections with background
        document.querySelectorAll('.quote-section, .about-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                const yPos = (scrollPosition - sectionTop) * 0.3;
                section.style.backgroundPositionY = `${yPos}px`;
            }
        });
    });
}

/**
 * Initialize 3D Statistics
 * Creates animated 3D counter elements with depth
 */
function initialize3DStatistics() {
    // Check if statistics section exists, if not create it
    let statisticsSection = document.querySelector('.statistics-section');
    
    if (!statisticsSection) {
        // Create statistics section with 3D elements
        statisticsSection = document.createElement('section');
        statisticsSection.className = 'statistics-section';
        
        statisticsSection.innerHTML = `
            <div class="container">
                <h2 class="section-title-3d">Our Success Story</h2>
                <div class="statistics-container">
                    <div class="statistic-item statistic-3d">
                        <div class="statistic-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="counter" data-target="500">0</div>
                        <p>Events Completed</p>
                    </div>
                    <div class="statistic-item statistic-3d">
                        <div class="statistic-icon"><i class="fas fa-users"></i></div>
                        <div class="counter" data-target="10000">0</div>
                        <p>Happy Clients</p>
                    </div>
                    <div class="statistic-item statistic-3d">
                        <div class="statistic-icon"><i class="fas fa-award"></i></div>
                        <div class="counter" data-target="25">0</div>
                        <p>Awards Won</p>
                    </div>
                    <div class="statistic-item statistic-3d">
                        <div class="statistic-icon"><i class="fas fa-map-marker-alt"></i></div>
                        <div class="counter" data-target="30">0</div>
                        <p>Cities Covered</p>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after about section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.parentNode.insertBefore(statisticsSection, aboutSection.nextSibling);
        } else {
            // Fallback - insert before packages section
            const packagesSection = document.getElementById('packages');
            if (packagesSection) {
                packagesSection.parentNode.insertBefore(statisticsSection, packagesSection);
            }
        }
    } else {
        // Add 3D classes to existing statistics
        statisticsSection.querySelectorAll('.statistic-item').forEach(item => {
            item.classList.add('statistic-3d');
        });
    }
    
    // Animate counters with 3D effect
    const counters = document.querySelectorAll('.counter');
    const options = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // ms
                const step = Math.ceil(target / (duration / 20)); // Update every 20ms
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current > target) current = target;
                    counter.textContent = current.toLocaleString();
                    
                    // Add 3D pop effect during counting
                    counter.style.transform = 'translateZ(20px) scale(1.1)';
                    setTimeout(() => {
                        counter.style.transform = 'translateZ(0) scale(1)';
                    }, 100);
                    
                    if (current < target) {
                        setTimeout(updateCounter, 20);
                    } else {
                        // Final animation when counter reaches target
                        counter.style.transform = 'translateZ(30px) scale(1.2)';
                        setTimeout(() => {
                            counter.style.transform = 'translateZ(0) scale(1)';
                        }, 300);
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Initialize Testimonial 3D Carousel
 * Creates a rotating 3D carousel for testimonials
 */
function initializeTestimonial3DCarousel() {
    // Create testimonials section if it doesn't exist
    if (!document.querySelector('.testimonials-section')) {
        const testimonialsSection = document.createElement('section');
        testimonialsSection.className = 'testimonials-section';
        
        testimonialsSection.innerHTML = `
            <div class="container">
                <h2 class="section-title-3d">What Our Clients Say</h2>
                <div class="testimonial-carousel-3d">
                    <div class="carousel-container">
                        <div class="carousel-track">
                            <div class="testimonial-card">
                                <div class="testimonial-content">
                                    <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                                    <p>"Eventica transformed our corporate event into an unforgettable experience. The attention to detail was impeccable!"</p>
                                    <div class="testimonial-author">
                                        <div class="author-image"></div>
                                        <div class="author-info">
                                            <h4>Sarah Johnson</h4>
                                            <p>Marketing Director</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="testimonial-card">
                                <div class="testimonial-content">
                                    <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                                    <p>"Our wedding was absolutely magical thanks to Eventica. They handled everything perfectly and made our special day stress-free."</p>
                                    <div class="testimonial-author">
                                        <div class="author-image"></div>
                                        <div class="author-info">
                                            <h4>Michael & Lisa</h4>
                                            <p>Newlyweds</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="testimonial-card">
                                <div class="testimonial-content">
                                    <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                                    <p>"The birthday party Eventica organized for my daughter was beyond expectations. The decorations, entertainment, everything was perfect!"</p>
                                    <div class="testimonial-author">
                                        <div class="author-image"></div>
                                        <div class="author-info">
                                            <h4>David Miller</h4>
                                            <p>Happy Parent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-controls">
                        <button class="carousel-control prev"><i class="fas fa-chevron-left"></i></button>
                        <button class="carousel-control next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.parentNode.insertBefore(testimonialsSection, contactSection);
        } else {
            // Fallback - insert after packages section
            const packagesSection = document.getElementById('packages');
            if (packagesSection) {
                packagesSection.parentNode.insertBefore(testimonialsSection, packagesSection.nextSibling);
            }
        }
        
        // Initialize carousel functionality
        const track = document.querySelector('.carousel-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        let currentIndex = 0;
        
        // Set initial positions
        updateCarousel();
        
        // Add event listeners for controls
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
        
        function updateCarousel() {
            cards.forEach((card, index) => {
                // Calculate position relative to current index
                const position = (index - currentIndex + cards.length) % cards.length;
                
                // Apply 3D transformations based on position
                if (position === 0) {
                    // Current card (center)
                    card.style.transform = 'translateX(0) translateZ(100px) rotateY(0deg)';
                    card.style.opacity = '1';
                    card.style.zIndex = '3';
                } else if (position === 1 || position === cards.length - 1) {
                    // Adjacent cards
                    const direction = position === 1 ? 1 : -1;
                    card.style.transform = `translateX(${direction * 50}%) translateZ(50px) rotateY(${direction * -15}deg)`;
                    card.style.opacity = '0.7';
                    card.style.zIndex = '2';
                } else {
                    // Hidden cards
                    card.style.transform = 'translateX(0) translateZ(-100px) rotateY(0deg)';
                    card.style.opacity = '0';
                    card.style.zIndex = '1';
                }
            });
        }
        
        // Auto-rotate carousel
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 5000);
    }
}

/**
 * Initialize Event Gallery with 3D Effects
 * Creates an interactive 3D gallery of past events
 */
function initializeEventGallery3D() {
    // Create gallery section if it doesn't exist
    if (!document.querySelector('.gallery-section')) {
        const gallerySection = document.createElement('section');
        gallerySection.className = 'gallery-section';
        
        gallerySection.innerHTML = `
            <div class="container">
                <h2 class="section-title-3d">Event Gallery</h2>
                <div class="gallery-3d-container">
                    <div class="gallery-3d-item">
                        <div class="gallery-3d-card">
                            <div class="gallery-3d-front">
                                <img src="images/wedding-package.jpg" alt="Wedding Event">
                            </div>
                            <div class="gallery-3d-back">
                                <h3>Elegant Wedding</h3>
                                <p>A beautiful beachside wedding with 200 guests</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-3d-item">
                        <div class="gallery-3d-card">
                            <div class="gallery-3d-front">
                                <img src="images/corporate-event.jpg" alt="Corporate Event">
                            </div>
                            <div class="gallery-3d-back">
                                <h3>Annual Conference</h3>
                                <p>Tech industry conference with interactive displays</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-3d-item">
                        <div class="gallery-3d-card">
                            <div class="gallery-3d-front">
                                <img src="images/birthday-surprise.jpg" alt="Birthday Party">
                            </div>
                            <div class="gallery-3d-back">
                                <h3>Surprise Birthday</h3>
                                <p>An unforgettable 30th birthday celebration</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-3d-item">
                        <div class="gallery-3d-card">
                            <div class="gallery-3d-front">
                                <img src="images/festival-package.jpg" alt="Festival Event">
                            </div>
                            <div class="gallery-3d-back">
                                <h3>Summer Festival</h3>
                                <p>Three-day music and arts festival</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before AI assistant section
        const aiSection = document.querySelector('.ai-assistant-section');
        if (aiSection) {
            aiSection.parentNode.insertBefore(gallerySection, aiSection);
        } else {
            // Fallback - insert before contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.parentNode.insertBefore(gallerySection, contactSection);
            }
        }
        
        // Add flip effect to gallery cards
        const galleryCards = document.querySelectorAll('.gallery-3d-card');
        galleryCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
        });
    }
}

/**
 * Initialize Event Countdown Timer
 * Creates a 3D countdown timer for upcoming events
 */
function initializeCountdownTimer() {
    // Create countdown section if it doesn't exist
    if (!document.querySelector('.countdown-section')) {
        const countdownSection = document.createElement('section');
        countdownSection.className = 'countdown-section';
        
        // Set event date to 30 days from now
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 30);
        
        countdownSection.innerHTML = `
            <div class="container">
                <h2 class="section-title-3d">Next Big Event</h2>
                <div class="event-info">
                    <h3>Annual Summer Gala</h3>
                    <p>Join us for an unforgettable evening of entertainment and networking</p>
                </div>
                <div class="countdown-timer" data-event-date="${eventDate.toISOString()}">
                    <div class="countdown-item">
                        <div class="countdown-value" id="countdown-days">00</div>
                        <div class="countdown-label">Days</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-value" id="countdown-hours">00</div>
                        <div class="countdown-label">Hours</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-value" id="countdown-minutes">00</div>
                        <div class="countdown-label">Minutes</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-value" id="countdown-seconds">00</div>
                        <div class="countdown-label">Seconds</div>
                    </div>
                </div>
                <button class="btn primary-btn countdown-btn">Reserve Your Spot</button>
            </div>
        `;
        
        // Insert after hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.parentNode.insertBefore(countdownSection, heroSection.nextSibling);
        }
        
        // Initialize countdown functionality
        const countdownTimer = document.querySelector('.countdown-timer');
        const eventDateStr = countdownTimer.getAttribute('data-event-date');
        const eventDateObj = new Date(eventDateStr);
        
        function updateCountdown() {
            const now = new Date();
            const diff = eventDateObj - now;
            
            if (diff <= 0) {
                // Event has passed
                document.getElementById('countdown-days').textContent = '00';
                document.getElementById('countdown-hours').textContent = '00';
                document.getElementById('countdown-minutes').textContent = '00';
                document.getElementById('countdown-seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
            document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
            
            // Add 3D pulse effect to changing values
            if (seconds % 2 === 0) {
                document.getElementById('countdown-seconds').classList.add('pulse-3d');
                setTimeout(() => {
                    document.getElementById('countdown-seconds').classList.remove('pulse-3d');
                }, 500);
            }
            
            if (seconds === 59) {
                document.getElementById('countdown-minutes').classList.add('pulse-3d');
                setTimeout(() => {
                    document.getElementById('countdown-minutes').classList.remove('pulse-3d');
                }, 500);
            }
        }
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Add event listener to reservation button
        const reserveBtn = document.querySelector('.countdown-btn');
        if (reserveBtn) {
            reserveBtn.addEventListener('click', function() {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

/**
 * Initialize Floating Elements
 * Creates floating 3D elements throughout the page
 */
function initializeFloatingElements() {
    // Add floating elements to various sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        // Skip sections that already have floating elements
        if (section.querySelector('.floating-element')) return;
        
        // Add 2-3 floating elements per section
        const numElements = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numElements; i++) {
            const floatingEl = document.createElement('div');
            floatingEl.className = 'floating-element';
            
            // Randomize appearance
            const size = Math.floor(Math.random() * 50) + 30;
            const opacity = Math.random() * 0.15 + 0.05;
            const animDuration = Math.floor(Math.random() * 20) + 10;
            
            floatingEl.style.width = `${size}px`;
            floatingEl.style.height = `${size}px`;
            floatingEl.style.opacity = opacity;
            floatingEl.style.left = `${Math.random() * 90}%`;
            floatingEl.style.top = `${Math.random() * 70}%`;
            floatingEl.style.animationDuration = `${animDuration}s`;
            
            // Add different shapes
            const shapeType = Math.floor(Math.random() * 3);
            if (shapeType === 0) {
                floatingEl.classList.add('floating-circle');
            } else if (shapeType === 1) {
                floatingEl.classList.add('floating-square');
            } else {
                floatingEl.classList.add('floating-triangle');
            }
            
            section.appendChild(floatingEl);
        }
    });
}