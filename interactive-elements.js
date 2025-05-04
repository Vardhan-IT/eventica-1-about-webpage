/**
 * Interactive Elements for Event Planning Website
 * Adds dynamic UI elements and practical functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initializeCounters();
    initializeTestimonialSlider();
    initializeEventCountdown();
    initializeImageGallery();
    initializeAnimatedStats();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return; // Skip if it's just '#'
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav links
            document.querySelectorAll('.nav-links a, .bottom-nav-item').forEach(link => {
                link.classList.remove('active');
            });
            
            document.querySelectorAll(`.nav-links a[href="${targetId}"], .bottom-nav-item[href="${targetId}"]`).forEach(link => {
                link.classList.add('active');
            });
        });
    });
});

/**
 * Animated Counters for Statistics
 * Displays animated counting for impressive statistics
 */
function initializeCounters() {
    // Create statistics section if it doesn't exist
    if (!document.querySelector('.statistics-section')) {
        const packagesSection = document.querySelector('.packages-section');
        if (!packagesSection) return;
        
        const statisticsSection = document.createElement('section');
        statisticsSection.className = 'statistics-section';
        statisticsSection.innerHTML = `
            <div class="container">
                <h2>Our Success Story</h2>
                <div class="statistics-container">
                    <div class="statistic-item">
                        <i class="fas fa-calendar-check"></i>
                        <div class="counter" data-target="500">0</div>
                        <p>Events Completed</p>
                    </div>
                    <div class="statistic-item">
                        <i class="fas fa-users"></i>
                        <div class="counter" data-target="10000">0</div>
                        <p>Happy Clients</p>
                    </div>
                    <div class="statistic-item">
                        <i class="fas fa-award"></i>
                        <div class="counter" data-target="25">0</div>
                        <p>Awards Won</p>
                    </div>
                    <div class="statistic-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="counter" data-target="30">0</div>
                        <p>Cities Covered</p>
                    </div>
                </div>
            </div>
        `;
        
        packagesSection.parentNode.insertBefore(statisticsSection, packagesSection.nextSibling);
    }
    
    // Animate counters when they come into view
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
                    
                    if (current < target) {
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.classList.add('completed');
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
 * Testimonial Slider
 * Creates an interactive testimonial carousel
 */
function initializeTestimonialSlider() {
    // Create testimonials section if it doesn't exist
    if (!document.querySelector('.testimonials-section')) {
        const quoteSection = document.querySelector('.quote-section');
        if (!quoteSection) return;
        
        const testimonialsSection = document.createElement('section');
        testimonialsSection.className = 'testimonials-section';
        testimonialsSection.innerHTML = `
            <div class="container">
                <h2>What Our Clients Say</h2>
                <div class="testimonial-slider">
                    <div class="testimonial-container">
                        <div class="testimonial-slide active">
                            <div class="testimonial-content">
                                <div class="testimonial-image">
                                    <img src="images/testimonial1.jpg" alt="Client" onerror="this.src='https://via.placeholder.com/100x100?text=Client'">
                                </div>
                                <div class="testimonial-text">
                                    <p>"Eventica transformed our corporate event into an unforgettable experience. Their attention to detail and creative approach exceeded our expectations!"</p>
                                    <h4>Sarah Johnson</h4>
                                    <p class="testimonial-position">Marketing Director, TechCorp</p>
                                    <div class="testimonial-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-slide">
                            <div class="testimonial-content">
                                <div class="testimonial-image">
                                    <img src="images/testimonial2.jpg" alt="Client" onerror="this.src='https://via.placeholder.com/100x100?text=Client'">
                                </div>
                                <div class="testimonial-text">
                                    <p>"Our wedding day was perfect thanks to Eventica. They handled everything professionally and made our special day stress-free and beautiful."</p>
                                    <h4>Michael & Emily Davis</h4>
                                    <p class="testimonial-position">Newlyweds</p>
                                    <div class="testimonial-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-slide">
                            <div class="testimonial-content">
                                <div class="testimonial-image">
                                    <img src="images/testimonial3.jpg" alt="Client" onerror="this.src='https://via.placeholder.com/100x100?text=Client'">
                                </div>
                                <div class="testimonial-text">
                                    <p>"The birthday party Eventica organized for my daughter was magical! The decorations, entertainment, and coordination were all perfect."</p>
                                    <h4>Jennifer Martinez</h4>
                                    <p class="testimonial-position">Mother of two</p>
                                    <div class="testimonial-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-controls">
                        <button class="testimonial-prev"><i class="fas fa-chevron-left"></i></button>
                        <div class="testimonial-dots">
                            <span class="testimonial-dot active" data-slide="0"></span>
                            <span class="testimonial-dot" data-slide="1"></span>
                            <span class="testimonial-dot" data-slide="2"></span>
                        </div>
                        <button class="testimonial-next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        quoteSection.parentNode.insertBefore(testimonialsSection, quoteSection);
        
        // Add event listeners for testimonial slider controls
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
}

/**
 * Event Countdown Timer
 * Displays a countdown to an upcoming event
 */
function initializeEventCountdown() {
    // Create countdown section if it doesn't exist
    if (!document.querySelector('.countdown-section')) {
        const aboutSection = document.querySelector('.about-section');
        if (!aboutSection) return;
        
        const countdownSection = document.createElement('section');
        countdownSection.className = 'countdown-section';
        countdownSection.innerHTML = `
            <div class="container">
                <h2>Next Showcase Event</h2>
                <div class="countdown-container">
                    <div class="countdown-event-details">
                        <h3>Annual Wedding Expo</h3>
                        <p><i class="fas fa-map-marker-alt"></i> Grand Convention Center</p>
                        <p><i class="fas fa-calendar-alt"></i> December 15, 2023</p>
                        <button class="btn primary-btn">Register Now</button>
                    </div>
                    <div class="countdown-timer">
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
                </div>
            </div>
        `;
        
        aboutSection.parentNode.insertBefore(countdownSection, aboutSection.nextSibling);
        
        // Set the countdown date (3 months from now)
        const countdownDate = new Date();
        countdownDate.setMonth(countdownDate.getMonth() + 3);
        
        // Update countdown every second
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
            document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.querySelector('.countdown-timer').innerHTML = '<h3>Event Started!</h3>';
            }
        }
        
        updateCountdown(); // Run once immediately
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
}

/**
 * Interactive Image Gallery
 * Creates a filterable image gallery with lightbox functionality
 */
function initializeImageGallery() {
    // Create gallery section if it doesn't exist
    if (!document.querySelector('.gallery-section')) {
        const packagesSection = document.querySelector('.packages-section');
        if (!packagesSection) return;
        
        const gallerySection = document.createElement('section');
        gallerySection.className = 'gallery-section';
        gallerySection.innerHTML = `
            <div class="container">
                <h2>Event Gallery</h2>
                <div class="gallery-filter">
                    <button class="gallery-filter-btn active" data-filter="all">All Events</button>
                    <button class="gallery-filter-btn" data-filter="wedding">Weddings</button>
                    <button class="gallery-filter-btn" data-filter="corporate">Corporate</button>
                    <button class="gallery-filter-btn" data-filter="birthday">Birthdays</button>
                </div>
                <div class="gallery-container">
                    <div class="gallery-item" data-category="wedding">
                        <img src="images/wedding-gallery1.jpg" alt="Wedding Event" onerror="this.src='https://via.placeholder.com/400x300?text=Wedding+Event'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Elegant Wedding</h3>
                                <p>Beachside ceremony with 200 guests</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-item" data-category="corporate">
                        <img src="images/corporate-gallery1.jpg" alt="Corporate Event" onerror="this.src='https://via.placeholder.com/400x300?text=Corporate+Event'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Annual Conference</h3>
                                <p>Tech industry summit for 500 attendees</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-item" data-category="birthday">
                        <img src="images/birthday-gallery1.jpg" alt="Birthday Party" onerror="this.src='https://via.placeholder.com/400x300?text=Birthday+Party'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Sweet 16 Celebration</h3>
                                <p>Themed party with custom decorations</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-item" data-category="wedding">
                        <img src="images/wedding-gallery2.jpg" alt="Wedding Event" onerror="this.src='https://via.placeholder.com/400x300?text=Wedding+Event'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Garden Wedding</h3>
                                <p>Intimate ceremony with natural decor</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-item" data-category="corporate">
                        <img src="images/corporate-gallery2.jpg" alt="Corporate Event" onerror="this.src='https://via.placeholder.com/400x300?text=Corporate+Event'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Product Launch</h3>
                                <p>Interactive showcase with media coverage</p>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-item" data-category="birthday">
                        <img src="images/birthday-gallery2.jpg" alt="Birthday Party" onerror="this.src='https://via.placeholder.com/400x300?text=Birthday+Party'">
                        <div class="gallery-overlay">
                            <div class="gallery-info">
                                <h3>Kids Birthday Bash</h3>
                                <p>Colorful carnival theme with activities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gallery-lightbox" id="gallery-lightbox">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-content" id="lightbox-img">
                <div class="lightbox-caption" id="lightbox-caption"></div>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        const aiAssistantSection = document.querySelector('.ai-assistant-section');
        if (aiAssistantSection) {
            aiAssistantSection.parentNode.insertBefore(gallerySection, aiAssistantSection);
        } else {
            packagesSection.parentNode.insertBefore(gallerySection, packagesSection.nextSibling);
        }
        
        // Add event listeners for gallery filtering
        const filterButtons = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Add lightbox functionality
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        let currentImageIndex = 0;
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
                lightbox.style.display = 'flex';
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 10);
                
                currentImageIndex = index;
                updateLightboxNavigation();
            });
        });
        
        function updateLightboxNavigation() {
            // Show/hide prev/next buttons based on current image
            if (currentImageIndex === 0) {
                lightboxPrev.style.display = 'none';
            } else {
                lightboxPrev.style.display = 'block';
            }
            
            if (currentImageIndex === galleryItems.length - 1) {
                lightboxNext.style.display = 'none';
            } else {
                lightboxNext.style.display = 'block';
            }
        }
        
        lightboxClose.addEventListener('click', () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        });
        
        lightboxPrev.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                const prevItem = galleryItems[currentImageIndex];
                const img = prevItem.querySelector('img');
                const title = prevItem.querySelector('h3').textContent;
                const description = prevItem.querySelector('p').textContent;
                
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.src = img.src;
                    lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
                    lightboxImg.style.opacity = '1';
                }, 300);
                
                updateLightboxNavigation();
            }
        });
        
        lightboxNext.addEventListener('click', () => {
            if (currentImageIndex < galleryItems.length - 1) {
                currentImageIndex++;
                const nextItem = galleryItems[currentImageIndex];
                const img = nextItem.querySelector('img');
                const title = nextItem.querySelector('h3').textContent;
                const description = nextItem.querySelector('p').textContent;
                
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.src = img.src;
                    lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
                    lightboxImg.style.opacity = '1';
                }, 300);
                
                updateLightboxNavigation();
            }
        });
    }
}

/**
 * Animated Statistics
 * Adds animated progress bars and charts for statistics
 */
function initializeAnimatedStats() {
    // Create animated stats section if it doesn't exist
    if (!document.querySelector('.animated-stats-section')) {
        const statisticsSection = document.querySelector('.statistics-section');
        if (!statisticsSection) return;
        
        const animatedStatsSection = document.createElement('section');
        animatedStatsSection.className = 'animated-stats-section';
        animatedStatsSection.innerHTML = `
            <div class="container">
                <h2>Our Expertise</h2>
                <div class="stats-container">
                    <div class="stat-item">
                        <div class="stat-info">
                            <h3>Wedding Planning</h3>
                            <span>95%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" data-width="95"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-info">
                            <h3>Corporate Events</h3>
                            <span>90%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" data-width="90"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-info">
                            <h3>Birthday Parties</h3>
                            <span>85%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" data-width="85"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-info">
                            <h3>Festival Management</h3>
                            <span>80%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" data-width="80"></div>
                        </div>
                    </div>
                </div>
                <div class="pie-charts-container">
                    <div class="pie-chart-item">
                        <div class="pie-chart" data-percentage="75">
                            <svg viewBox="0 0 36 36" class="circular-chart">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="circle" stroke-dasharray="75, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="percentage">75%</text>
                            </svg>
                            <h3>Client Retention</h3>
                        </div>
                    </div>
                    <div class="pie-chart-item">
                        <div class="pie-chart" data-percentage="90">
                            <svg viewBox="0 0 36 36" class="circular-chart">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="circle" stroke-dasharray="90, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="percentage">90%</text>
                            </svg>
                            <h3>Customer Satisfaction</h3>
                        </div>
                    </div>
                    <div class="pie-chart-item">
                        <div class="pie-chart" data-percentage="60">
                            <svg viewBox="0 0 36 36" class="circular-chart">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="circle" stroke-dasharray="60, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="percentage">60%</text>
                            </svg>
                            <h3>Repeat Business</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        statisticsSection.parentNode.insertBefore(animatedStatsSection, statisticsSection.nextSibling);
        
        // Animate progress bars when they come into view
        const progressBars = document.querySelectorAll('.progress-fill');
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    progressBar.style.width = `${width}%`;
                    observer.unobserve(progressBar);
                }
            });
        }, options);
        
        progressBars.forEach(progressBar => {
            observer.observe(progressBar);
        });
        
        // Animate pie charts when they come into view
        const pieCharts = document.querySelectorAll('.pie-chart');
        
        const pieObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const pieChart = entry.target;
                    const percentage = pieChart.getAttribute('data-percentage');
                    const circle = pieChart.querySelector('.circle');
                    
                    circle.style.strokeDasharray = `${percentage}, 100`;
                    pieObserver.unobserve(pieChart);
                }
            });
        }, options);
        
        pieCharts.forEach(pieChart => {
            pieObserver.observe(pieChart);
        });
    }
}