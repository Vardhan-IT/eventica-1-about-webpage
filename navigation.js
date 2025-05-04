document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality for main navigation and bottom navigation
    
    // Get all navigation links from the top navigation bar
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Get all navigation items from the bottom navigation bar
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    // Function to handle navigation
    function handleNavigation(e, targetSelector) {
        e.preventDefault();
        
        // Remove active class from all navigation links
        navLinks.forEach(link => link.classList.remove('active'));
        bottomNavItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to the clicked link
        e.currentTarget.classList.add('active');
        
        // Handle special case for cart
        if (targetSelector === '#cart') {
            // Find and show the cart modal
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) {
                // Update cart modal content if there's a function for it
                if (typeof updateCartModal === 'function') {
                    updateCartModal();
                }
                cartModal.style.display = 'block';
                if (cartModal.classList) {
                    cartModal.classList.add('show');
                }
            }
            return;
        }
        
        // For other navigation items, scroll to the target section
        const targetSection = document.querySelector(targetSelector);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Find and activate corresponding navigation item in the other nav bar
        if (e.currentTarget.closest('.nav-links')) {
            // If clicked in top nav, update bottom nav
            const correspondingBottomItem = document.querySelector(`.bottom-nav-item[href="${targetSelector}"]`);
            if (correspondingBottomItem) {
                correspondingBottomItem.classList.add('active');
            }
        } else if (e.currentTarget.closest('.bottom-nav')) {
            // If clicked in bottom nav, update top nav
            const correspondingTopItem = document.querySelector(`.nav-links a[href="${targetSelector}"]`);
            if (correspondingTopItem) {
                correspondingTopItem.classList.add('active');
            }
        }
    }
    
    // Add click event listeners to top navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' && this.id === 'nav-cart-btn') {
                handleNavigation(e, '#cart');
            } else {
                handleNavigation(e, href);
            }
        });
    });
    
    // Add click event listeners to bottom navigation items
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (this.id === 'cart-btn') {
                handleNavigation(e, '#cart');
            } else {
                handleNavigation(e, href);
            }
        });
    });
    
    // Ensure the cart button in the top navigation is styled inline with other buttons
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.style.display = 'inline-flex';
        navCartBtn.style.alignItems = 'center';
    }
});