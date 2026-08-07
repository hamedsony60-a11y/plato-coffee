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
            // Simple mobile nav style injection
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

// Simple cart counter demo
let cartCount = 0;
const cartCountEl = document.querySelector('.cart-count');
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('dblclick', () => {
        cartCount++;
        if (cartCountEl) cartCountEl.textContent = cartCount;
    });
});
