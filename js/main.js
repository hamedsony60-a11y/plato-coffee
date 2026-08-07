// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
        const icon = mobileBtn.querySelector('i');
        if (nav.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            nav.style.display = 'block';
            nav.style.position = 'absolute';
            nav.style.top = '70px';
            nav.style.right = '0';
            nav.style.left = '0';
            nav.style.background = '#faf6f1';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            nav.querySelector('ul').style.flexDirection = 'column';
            nav.querySelector('ul').style.gap = '16px';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            nav.style.display = '';
            nav.style.position = '';
            nav.style.top = '';
            nav.style.right = '';
            nav.style.left = '';
            nav.style.background = '';
            nav.style.padding = '';
            nav.style.boxShadow = '';
            nav.querySelector('ul').style.flexDirection = '';
            nav.querySelector('ul').style.gap = '';
        }
    });
}

// Wishlist toggle
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#e74c3c';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
        }
    });
});

// Newsletter form
const form = document.querySelector('.newsletter-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input.value) {
            alert('با تشکر! ایمیل شما با موفقیت ثبت شد.');
            input.value = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Cart functionality with localStorage - ready to use
let cart = JSON.parse(localStorage.getItem('platoCart') || '[]');
const cartCountEl = document.querySelector('.cart-count');

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = total;
}

updateCartCount();

// Click on product card to add to cart
document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (e.target.closest('.wishlist-btn')) return;
        const name = card.querySelector('h3')?.textContent?.trim() || 'محصول';
        const price = card.querySelector('.current-price')?.textContent?.trim() || '';
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        localStorage.setItem('platoCart', JSON.stringify(cart));
        updateCartCount();
        // Toast feedback
        const toast = document.createElement('div');
        toast.textContent = '✓ به سبد خرید اضافه شد';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#3d2b1f;color:#fff;padding:14px 28px;border-radius:50px;font-family:Vazirmatn,sans-serif;z-index:9999;font-size:14px;font-weight:500;box-shadow:0 8px 30px rgba(0,0,0,0.25);';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    });
});

// Cart button shows summary
document.querySelector('.cart-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است');
        return;
    }
    let msg = '🛒 سبد خرید شما:\n\n';
    let totalItems = 0;
    cart.forEach(item => {
        msg += `• ${item.name}\n  تعداد: ${item.qty} | ${item.price}\n\n`;
        totalItems += item.qty;
    });
    msg += `────────────────\nجمع اقلام: ${totalItems} عدد\n\n(برای خالی کردن سبد خرید: localStorage.removeItem("platoCart"))`;
    alert(msg);
});
