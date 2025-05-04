document.addEventListener('DOMContentLoaded', function() {
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

    // Add to Home Screen functionality
    let deferredPrompt;
    const addToHomeBtn = document.createElement('button');
    addToHomeBtn.style.display = 'none';
    addToHomeBtn.className = 'add-to-home-btn';
    addToHomeBtn.textContent = 'Install App';
    document.body.appendChild(addToHomeBtn);

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the button
        addToHomeBtn.style.display = 'block';
        
        addToHomeBtn.addEventListener('click', () => {
            // Hide the button
            addToHomeBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    showNotification('App installed successfully!');
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

    // Learn More button scroll
    const learnMoreBtn = document.getElementById('learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const packageCards = document.querySelectorAll('.package-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-category');
            
            // Show all packages if "All" is selected, otherwise filter
            packageCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Package details modal
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

            // Create package details content
            packageDetailsContent.innerHTML = `
                <img src="${packageImage}" alt="${packageTitle}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
                <h2>${packageTitle}</h2>
                <p>${packageDescription}</p>
                <p class="price" style="font-size: 1.5rem; font-weight: 700; color: #ff6b6b; margin: 20px 0;">${packagePrice}</p>
                <h3>Package Includes:</h3>
                <ul style="margin-left: 20px; margin-bottom: 20px;">
                    <li>Professional event planning</li>
                    <li>Venue coordination</li>
                    <li>Decoration setup</li>
                    <li>Event day coordination</li>
                    <li>Post-event cleanup</li>
                </ul>
                <button class="btn primary-btn add-to-cart-modal-btn" style="width: 100%;">Add to Cart</button>
            `;

            // Show modal
            packageModal.style.display = 'block';

            // Add event listener to the Add to Cart button in the modal
            const addToCartModalBtn = packageDetailsContent.querySelector('.add-to-cart-modal-btn');
            addToCartModalBtn.addEventListener('click', function() {
                addToCart(packageTitle, packagePrice, packageImage);
                packageModal.style.display = 'none';
            });
        });
    });

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageTitle = packageCard.querySelector('h3').textContent;
            const packagePrice = packageCard.querySelector('.price').textContent;
            const packageImage = packageCard.querySelector('img').src;
            
            addToCart(packageTitle, packagePrice, packageImage);
        });
    });

    function addToCart(title, price, image) {
        // Extract numeric price
        const priceValue = parseFloat(price.replace('$', '').replace(',', ''));
        
        // Load existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
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
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count and show notification
        updateCartCount();
        showNotification(`${title} added to cart!`);
        
        // Redirect to cart page
        window.location.href = 'cart.html';
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#ff6b6b';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Cart modal functionality
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
        });
    }
    
    cartBtn.addEventListener('click', function() {
        updateCartModal();
        cartModal.style.display = 'block';
    });

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const navCartCount = document.querySelector('.nav-cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update bottom nav cart count
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        // Update top nav cart count if it exists
        if (navCartCount) {
            navCartCount.textContent = totalItems;
        }
    }

    function updateCartModal() {
        // Clear current cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalAmount.textContent = '$0';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart modal
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
                <div class="cart-item-remove" data-index="${index}">✕</div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Update total amount
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
                updateCartModal();
            });
        });
    }
    
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            updateCartCount();
        }
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        // In a real application, this would redirect to a checkout page
        showNotification('Proceeding to checkout...');
        setTimeout(() => {
            cart = [];
            updateCartCount();
            cartModal.style.display = 'none';
            showNotification('Order placed successfully!');
        }, 2000);
    });
    
    // Account modal functionality
    const accountBtn = document.getElementById('account-btn');
    const accountModal = document.getElementById('account-modal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    accountBtn.addEventListener('click', function() {
        accountModal.style.display = 'block';
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
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const quoteForm = document.getElementById('quote-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Login successful!');
            accountModal.style.display = 'none';
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Account created successfully!');
            accountModal.style.display = 'none';
        });
    }
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Quote request submitted! We will contact you soon.');
            this.reset();
        });
    }
    
    // AI Event Assistant functionality
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
        
        // Add user message to chat
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'user-message';
        userMessageElement.textContent = userMessage;
        aiChatWindow.appendChild(userMessageElement);
        
        // Clear input
        aiInput.value = '';
        
        // Scroll to bottom
        aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        
        // Simulate AI thinking
        setTimeout(() => {
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
            
            // Add AI response to chat
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'ai-message';
            aiMessageElement.textContent = aiResponse;
            aiChatWindow.appendChild(aiMessageElement);
            
            // Scroll to bottom
            aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        }, 1000);
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
    
    // Bottom navigation active state
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize with first category active
    if (categoryButtons.length > 0) {
        categoryButtons[0].click();
    }
});