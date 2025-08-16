document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Shopping Cart Toggle
    const cartButton = document.getElementById('cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    const continueShopping = document.getElementById('continue-shopping');
    
    const openCart = () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    const closeCartSidebar = () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    cartButton.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    continueShopping.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
    
    // Hero Carousel
    const heroSlides = document.querySelectorAll('.hero-slide');
    const carouselControls = document.querySelectorAll('.carousel-control');
    let currentSlide = 0;
    
    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        carouselControls.forEach(control => {
            control.classList.remove('bg-orange-600', 'opacity-100');
            control.classList.add('opacity-50');
        });
        
        heroSlides[index].classList.add('active');
        carouselControls[index].classList.add('bg-orange-600', 'opacity-100');
        carouselControls[index].classList.remove('opacity-50');
        currentSlide = index;
    }
    
    carouselControls.forEach((control, index) => {
        control.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-advance carousel
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(nextSlide);
    }, 5000);
    
    // Scroll animations
    const checkScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    
    // Shopping Cart Functionality
    let cart = [];
    
    // Item Customization Modal
    const customizationModal = document.getElementById('customization-modal');
    const closeModal = document.getElementById('close-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const addToCartModal = document.getElementById('add-to-cart-modal');
    const itemQty = document.getElementById('item-qty');
    const decreaseQty = document.getElementById('decrease-qty');
    const increaseQty = document.getElementById('increase-qty');
    const itemNotes = document.getElementById('item-notes');
    let currentItem = null;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentItem = {
                id: button.getAttribute('data-id'),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                quantity: 1,
                notes: ''
            };
            
            document.getElementById('modal-item-name').textContent = currentItem.name;
            document.getElementById('modal-item-price').textContent = `R$ ${currentItem.price.toFixed(2).replace('.', ',')}`;
            itemQty.textContent = '1';
            itemNotes.value = '';
            
            customizationModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModal.addEventListener('click', () => {
        customizationModal.classList.add('hidden');
        document.body.style.overflow = '';
    });
    
    decreaseQty.addEventListener('click', () => {
        let qty = parseInt(itemQty.textContent);
        if (qty > 1) {
            qty--;
            itemQty.textContent = qty;
        }
    });
    
    increaseQty.addEventListener('click', () => {
        let qty = parseInt(itemQty.textContent);
        qty++;
        itemQty.textContent = qty;
    });
    
    addToCartModal.addEventListener('click', () => {
        if (currentItem) {
            currentItem.quantity = parseInt(itemQty.textContent);
            currentItem.notes = itemNotes.value.trim();
            
            const existingItemIndex = cart.findIndex(item => 
                item.id === currentItem.id && item.notes === currentItem.notes
            );
            
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += currentItem.quantity;
            } else {
                cart.push({...currentItem});
            }
            
            updateCart();
            
            const cartIcon = document.querySelector('#cart-button i');
            cartIcon.classList.add('cart-shake');
            setTimeout(() => {
                cartIcon.classList.remove('cart-shake');
            }, 500);
            
            customizationModal.classList.add('hidden');
            openCart();
        }
    });
    
    // Update cart display
    function updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSummary = document.getElementById('cart-summary');
        const checkoutButton = document.getElementById('checkout-button');
        const cartCount = document.getElementById('cart-count');
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMessage);
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            checkoutButton.classList.add('hidden');
            cartCount.classList.add('hidden');
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        cartSummary.classList.remove('hidden');
        checkoutButton.classList.remove('hidden');
        cartCount.classList.remove('hidden');
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between items-center py-4 border-b border-gray-200';
            const notesHTML = item.notes ? `<p class="text-sm text-gray-500">${item.notes}</p>` : '';
            itemElement.innerHTML = `
                <div class="flex-1 pr-4">
                    <h4 class="font-bold">${item.name}</h4>
                    ${notesHTML}
                    <div class="flex items-center text-sm mt-2">
                        <span class="font-semibold">${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <div class="flex items-center">
                    <span class="font-bold mr-4">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = cart.length > 0 ? 5.00 : 0;
        const total = subtotal + deliveryFee;
        
        document.getElementById('cart-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('delivery-fee').textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
        document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Checkout button
    document.getElementById('checkout-button').addEventListener('click', () => {
        alert('Redirecionando para o checkout...');
    });
});