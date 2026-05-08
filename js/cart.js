document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.querySelector('.cart-toggle');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartContent = document.getElementById('cartContent');
    const cartCount = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCart');
    const closeCartBtn = document.querySelector('.close-cart');
    const addButtons = document.querySelectorAll('.producto-card button');

    let cart = JSON.parse(localStorage.getItem('shojoCart') || '[]');

    const formatPrice = value => Number(value).toFixed(2);

    const saveCart = () => {
        localStorage.setItem('shojoCart', JSON.stringify(cart));
    };

    const updateCartCount = () => {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    };

    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalEl.textContent = formatPrice(total);
    };

    const renderCart = () => {
        cartContent.innerHTML = '';

        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="cart-empty">Tu carrito está vacío. Agrega algunas camisetas para continuar.</p>';
            updateCartTotal();
            updateCartCount();
            return;
        }

        cart.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item';
            itemRow.innerHTML = `
                <div>
                    <p class="cart-product-name">${item.name}</p>
                    <p class="cart-product-price">${item.quantity} x $${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-remove" data-name="${item.name}">Eliminar</button>
                </div>
            `;
            cartContent.appendChild(itemRow);
        });

        updateCartTotal();
        updateCartCount();
    };

    const addProductToCart = product => {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        renderCart();
    };

    const removeProductFromCart = productName => {
        cart = cart.filter(item => item.name !== productName);
        saveCart();
        renderCart();
    };

    addButtons.forEach(button => {
        button.addEventListener('click', event => {
            const card = event.target.closest('.producto-card');
            const name = card.querySelector('h3').textContent.trim();
            const priceText = card.querySelector('.precio').textContent.replace('$', '').trim();
            const price = parseFloat(priceText);
            addProductToCart({ name, price });
            cartDrawer.classList.add('open');
            cartDrawer.classList.remove('hidden');
        });
    });

    cartToggle.addEventListener('click', () => {
        cartDrawer.classList.toggle('open');
        cartDrawer.classList.toggle('hidden');
    });

    closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        cartDrawer.classList.add('hidden');
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
    });

    cartContent.addEventListener('click', event => {
        if (event.target.classList.contains('cart-remove')) {
            const name = event.target.dataset.name;
            removeProductFromCart(name);
        }
    });

    renderCart();
});