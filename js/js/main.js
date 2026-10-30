
document.addEventListener('DOMContentLoaded', function() {
    
    // === CART COUNT ===
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('ubuntuCart') || '[]');
        const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        const el = document.getElementById('cartCount');
        if (el) el.textContent = count;
    }
    updateCartCount();

    // === ADD TO CART (for menu.html buttons with data-name data-price) ===
    window.addToCart = function(name, price, image) {
        let cart = JSON.parse(localStorage.getItem('ubuntuCart') || '[]');
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push({ name: name, price: price, image: image || '', qty: 1 });
        }
        localStorage.setItem('ubuntuCart', JSON.stringify(cart));
        updateCartCount();
        alert(name + ' added to cart! (R' + price + ') - Go to Menu to see total');
    };

    // Attach to buttons that have onclick="addToCart..."
    // Also handle buttons with class .add-btn
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.menu-card, .product-card');
            if (card) {
                const name = card.querySelector('h3')?.innerText || 'Coffee';
                const priceText = card.querySelector('.price')?.innerText || '0';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                const img = card.querySelector('img')?.src || '';
                addToCart(name, price, img);
            }
        });
    });

    // === BOOKING DATE VALIDATION (no past dates) ===
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // === NEWSLETTER POPUP ===
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            let list = JSON.parse(localStorage.getItem('ubuntuNewsletter') || '[]');
            if (!list.includes(email)) {
                list.push(email);
                localStorage.setItem('ubuntuNewsletter', JSON.stringify(list));
            }
            alert('Thanks! ' + email + ' subscribed - 10% off your first online order');
            this.reset();
        });
    }

    // === FORMS - Let FormSubmit handle it, but show loading ===
    const forms = document.querySelectorAll('#bookingForm, #contactForm, #enquiryForm');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;
            }
        });
    });

    console.log('Ubuntu Coffee main.js loaded - Cart count updated');
});

// === FILTER FUNCTION FOR MENU PAGE ===
function filterMenu(category) {
    const cards = document.querySelectorAll('.menu-card, .product-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`) || document.querySelector(`.filter-btn[onclick*="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}