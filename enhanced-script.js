document.addEventListener('DOMContentLoaded', function() {
    // Apply enhanced styles
    const enhancedStylesLink = document.createElement('link');
    enhancedStylesLink.rel = 'stylesheet';
    enhancedStylesLink.href = 'enhanced-styles.css';
    document.head.appendChild(enhancedStylesLink);
    
    // Apply section animations
    const sectionAnimationsLink = document.createElement('link');
    sectionAnimationsLink.rel = 'stylesheet';
    sectionAnimationsLink.href = 'section-animations.css';
    document.head.appendChild(sectionAnimationsLink);

    // Add scroll to top button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Register Service Worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

    // Add to Home Screen functionality with enhanced UI
    let deferredPrompt;
    const addToHomeBtn = document.createElement('button');
    addToHomeBtn.style.display = 'none';
    addToHomeBtn.className = 'add-to-home-btn';
    addToHomeBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    document.body.appendChild(addToHomeBtn);

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the button with animation
        addToHomeBtn.style.display = 'block';
        addToHomeBtn.style.animation = 'fadeIn 0.5s forwards';
        
        addToHomeBtn.addEventListener('click', () => {
            // Hide the button with animation
            addToHomeBtn.style.opacity = '0';
            setTimeout(() => {
                addToHomeBtn.style.display = 'none';
            }, 500);
            
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    showEnhancedNotification('App installed successfully!', 'success');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    // Initialize cart
    let cart = [];
    updateCartCount();

    // Learn More button scroll with smooth animation
    const learnMoreBtn = document.getElementById('learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Enhanced category filtering with animations
    const categoryButtons = document.querySelectorAll('.category-btn');
    const packageCards = document.querySelectorAll('.package-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-category');
            
            // Show all packages if "All" is selected, otherwise filter with animation
            packageCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Enhanced package details modal
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const packageModal = document.getElementById('package-modal');
    const packageDetailsContent = document.getElementById('package-details-content');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageTitle = packageCard.querySelector('h3').textContent;
            const packageDescription = packageCard.querySelector('p:not(.price)').textContent;
            const packagePrice = packageCard.querySelector('.price').textContent;
            const packageImage = packageCard.querySelector('img').src;

            // Create package details content with enhanced styling
            packageDetailsContent.innerHTML = `
                <img src="${packageImage}" alt="${packageTitle}" style="width: 100%; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h2 style="text-align: left; margin-bottom: 15px;">${packageTitle}</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">${packageDescription}</p>
                <p class="price" style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0;">${packagePrice}</p>
                <h3 style="margin: 20px 0 15px;">Package Includes:</h3>
                <ul style="margin-left: 20px; margin-bottom: 30px;">
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #ff6b6b; margin-right: 10px;"></i> Professional event planning</li>
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #ff6b6b; margin-right: 10px;"></i> Venue coordination</li>
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #ff6b6b; margin-right: 10px;"></i> Decoration setup</li>
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #ff6b6b; margin-right: 10px;"></i> Event day coordination</li>
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #ff6b6b; margin-right: 10px;"></i> Post-event cleanup</li>
                </ul>
                <button class="btn primary-btn add-to-cart-modal-btn" style="width: 100%; border-radius: 50px; padding: 15px; font-size: 1.1rem;"><i class="fas fa-shopping-cart" style="margin-right: 10px;"></i> Add to Cart</button>
            `;

            // Show modal with animation
            packageModal.style.display = 'block';
            setTimeout(() => {
                packageModal.classList.add('show');
            }, 10);

            // Add event listener to the Add to Cart button in the modal
            const addToCartModalBtn = packageDetailsContent.querySelector('.add-to-cart-modal-btn');
            addToCartModalBtn.addEventListener('click', function() {
                addToCart(packageTitle, packagePrice, packageImage);
                closeModal(packageModal);
            });
        });
    });

    // Enhanced modal closing
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Close modals with animation
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Enhanced Add to Cart functionality with animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageTitle = packageCard.querySelector('h3').textContent;
            const packagePrice = packageCard.querySelector('.price').textContent;
            const packageImage = packageCard.querySelector('img').src;
            
            // Add animation to button
            this.classList.add('adding');
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            
            setTimeout(() => {
                this.classList.remove('adding');
                this.innerHTML = 'Add to Cart';
            }, 1500);
            
            addToCart(packageTitle, packagePrice, packageImage);
        });
    });

    function addToCart(title, price, image) {
        // Extract numeric price
        const priceValue = parseFloat(price.replace('$', '').replace(',', ''));
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.title === title);
        
        if (existingItemIndex !== -1) {
            // Increment quantity if item exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                title: title,
                price: priceValue,
                image: image,
                quantity: 1
            });
        }
        
        // Update cart count and show notification
        updateCartCount();
        showEnhancedNotification(`${title} added to cart!`, 'success');
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const navCartCount = document.querySelector('.nav-cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update bottom nav cart count with animation
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('pulse');
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 1000);
        }
        
        // Update top nav cart count if it exists
        if (navCartCount) {
            navCartCount.textContent = totalItems;
            navCartCount.classList.add('pulse');
            setTimeout(() => {
                navCartCount.classList.remove('pulse');
            }, 1000);
        }
    }

    // Enhanced notification system
    function showEnhancedNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on notification type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? '#ff6b6b' : '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.minWidth = '250px';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.animation = 'slideUp 0.5s forwards';
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Enhanced Cart modal functionality
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    // Check if nav cart button exists before adding event listener
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartModal();
            cartModal.style.display = 'block';
            setTimeout(() => {
                cartModal.classList.add('show');
            }, 10);
        });
    }
    
    cartBtn.addEventListener('click', function() {
        updateCartModal();
        cartModal.style.display = 'block';
        setTimeout(() => {
            cartModal.classList.add('show');
        }, 10);
    });

    function updateCartModal() {
        // Clear current cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                    <p>Your cart is empty.</p>
                </div>
            `;
            cartTotalAmount.textContent = '$0';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart modal with enhanced styling
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <div class="cart-item-remove" data-index="${index}"><i class="fas fa-times"></i></div>
            `;
            
            cartItems.appendChild(cartItemElement);
            
            // Add animation
            setTimeout(() => {
                cartItemElement.style.opacity = '1';
                cartItemElement.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Update total amount
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const cartItem = this.closest('.cart-item');
                
                // Animate removal
                cartItem.style.opacity = '0';
                cartItem.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    removeFromCart(index);
                    updateCartModal();
                }, 300);
            });
        });
    }
    
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            const removedItem = cart[index];
            cart.splice(index, 1);
            updateCartCount();
            showEnhancedNotification(`${removedItem.title} removed from cart`, 'info');
        }
    }
    
    // Enhanced Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showEnhancedNotification('Your cart is empty!', 'warning');
            return;
        }
        
        // In a real application, this would redirect to a checkout page
        showEnhancedNotification('Proceeding to checkout...', 'info');
        
        // Add loading effect to button
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.disabled = true;
        
        setTimeout(() => {
            cart = [];
            updateCartCount();
            closeModal(cartModal);
            this.innerHTML = 'Checkout';
            this.disabled = false;
            showEnhancedNotification('Order placed successfully!', 'success');
        }, 2000);
    });
    
    // Enhanced Account modal functionality
    const accountBtn = document.getElementById('account-btn');
    const accountModal = document.getElementById('account-modal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    accountBtn.addEventListener('click', function() {
        accountModal.style.display = 'block';
        setTimeout(() => {
            accountModal.classList.add('show');
        }, 10);
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content and set button as active
            document.getElementById(`${tabName}-tab`).style.display = 'block';
            this.classList.add('active');
        });
    });
    
    // Enhanced Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const quoteForm = document.getElementById('quote-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading effect to button
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showEnhancedNotification('Login successful!', 'success');
                closeModal(accountModal);
                submitBtn.innerHTML = 'Login';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading effect to button
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showEnhancedNotification('Account created successfully!', 'success');
                closeModal(accountModal);
                submitBtn.innerHTML = 'Sign Up';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading effect to button
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showEnhancedNotification('Quote request submitted! We will contact you soon.', 'success');
                submitBtn.innerHTML = 'Request Quote';
                submitBtn.disabled = false;
                this.reset();
            }, 1500);
        });
    }
    
    // Enhanced AI Event Assistant functionality
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const eventTipsBtn = document.getElementById('event-tips-btn');
    
    // Sample responses for the AI assistant
    const aiResponses = {
        'hello': 'Hello! How can I help with your event planning today?',
        'hi': 'Hi there! Need help planning your event?',
        'event': 'Events require careful planning. What type of event are you planning?',
        'birthday': 'For birthday events, I recommend our Birthday Surprise package. It includes decorations, cake arrangements, and entertainment options!',
        'wedding': 'Wedding planning can be complex. Our Wedding Package includes venue selection, catering, decoration, and coordination on the big day.',
        'party': 'For parties, consider the number of guests, theme, venue, and catering. Our Elegant Party Decor package is perfect for most occasions!',
        'corporate': 'Corporate events require professional handling. Our Corporate Event Package includes venue booking, technical setup, and catering options.',
        'festival': 'Festivals are all about creating memorable experiences. Our Festival Experience package handles everything from permits to entertainment.',
        'budget': 'Budget planning is crucial. I recommend allocating 50% to venue and catering, 20% to decoration, 15% to entertainment, and 15% to miscellaneous expenses.',
        'venue': 'When selecting a venue, consider location, capacity, amenities, and accessibility. We can help you find the perfect venue for your event!',
        'food': 'Food and beverages typically account for 30-40% of your event budget. We offer various catering options to suit different preferences and dietary requirements.',
        'decoration': 'Decorations set the mood for your event. Our packages include professional decoration services tailored to your event theme.',
        'theme': 'Choosing a theme helps in planning decorations, invitations, and activities. Popular themes include vintage, tropical, minimalist, and seasonal themes.',
        'help': 'I can help with venue selection, budget planning, theme ideas, vendor recommendations, and timeline creation. What do you need assistance with?'
    };
    
    function sendAiMessage() {
        const userMessage = aiInput.value.trim();
        
        if (userMessage === '') return;
        
        // Add user message to chat with animation
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'user-message';
        userMessageElement.textContent = userMessage;
        userMessageElement.style.opacity = '0';
        userMessageElement.style.transform = 'translateY(20px)';
        aiChatWindow.appendChild(userMessageElement);
        
        // Animate in
        setTimeout(() => {
            userMessageElement.style.opacity = '1';
            userMessageElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Clear input
        aiInput.value = '';
        
        // Scroll to bottom
        aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'ai-message typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        aiChatWindow.appendChild(typingIndicator);
        
        // Scroll to bottom again
        aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        
        // Simulate AI thinking
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Generate AI response
            let aiResponse = 'I'm not sure how to help with that. Could you ask about event planning, venues, budgeting, or specific event types like weddings or birthdays?';
            
            // Check for keywords in user message
            const lowerCaseMessage = userMessage.toLowerCase();
            for (const keyword in aiResponses) {
                if (lowerCaseMessage.includes(keyword)) {
                    aiResponse = aiResponses[keyword];
                    break;
                }
            }
            
            // Add AI response to chat with animation
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'ai-message';
            aiMessageElement.textContent = aiResponse;
            aiMessageElement.style.opacity = '0';
            aiMessageElement.style.transform = 'translateY(20px)';
            aiChatWindow.appendChild(aiMessageElement);
            
            // Animate in
            setTimeout(() => {
                aiMessageElement.style.opacity = '1';
                aiMessageElement.style.transform = 'translateY(0)';
            }, 10);
            
            // Scroll to bottom
            aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        }, 1500);
    }
    
    aiSendBtn.addEventListener('click', sendAiMessage);
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAiMessage();
        }
    });
    
    eventTipsBtn.addEventListener('click', function() {
        document.querySelector('.ai-assistant-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            aiInput.focus();
        }, 1000);
    });
    
    // Enhanced Bottom navigation active state
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 10px 15px;
        }
        
        .typing-indicator span {
            height: 8px;
            width: 8px;
            float: left;
            margin: 0 1px;
            background-color: #9E9EA1;
            display: block;
            border-radius: 50%;
            opacity: 0.4;
        }
        
        .typing-indicator span:nth-of-type(1) {
            animation: 1s blink infinite 0.3333s;
        }
        
        .typing-indicator span:nth-of-type(2) {
            animation: 1s blink infinite 0.6666s;
        }
        
        .typing-indicator span:nth-of-type(3) {
            animation: 1s blink infinite 0.9999s;
        }
        
        @keyframes blink {
            50% {
                opacity: 1;
            }
        }
        
        .pulse {
            animation: pulse 0.5s;
        }
        
        .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            color: #999;
        }
        
        .adding {
            background-color: #4caf50 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with first category active
    if (categoryButtons.length > 0) {
        categoryButtons[0].click();
    }
    
    // Add section animations on scroll
    const sections = document.querySelectorAll('section');
    
    function checkSections() {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Check sections on initial load
    checkSections();
    
    // Check sections on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    
    function highlightNavOnScroll() {
        let scrollPosition = window.scrollY;
        
        // Add some offset to improve accuracy
        scrollPosition += 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if(sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Highlight top nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Highlight bottom nav
                bottomNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Add animation to the current section
                section.classList.add('section-visible');
            }
        });
        
        // Apply parallax effect to background elements
        const parallaxElements = document.querySelectorAll('.hero, .quote-section');
        parallaxElements.forEach(element => {
            const speed = 0.5; // Adjust the speed of the parallax effect
            const yPos = -(scrollPosition * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    }
    
    // Initial check on page load
    highlightNavOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', highlightNavOnScroll);
    window.addEventListener('scroll', checkSections);