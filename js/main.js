// ===== Products data for search =====
const PRODUCTS = [
    { id: 1, name: 'آسیاب قهوه دستی', cat: 'تجهیزات قهوه', price: '۱,۲۵۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&q=80' },
    { id: 2, name: 'پیچر استیل ۶۰۰ میلی', cat: 'تجهیزات باریستا', price: '۴۸۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80' },
    { id: 3, name: 'اسپرسوساز دلونگی', cat: 'ماشین‌های قهوه', price: '۱۲,۹۰۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100&q=80' },
    { id: 4, name: 'دانه قهوه ۲۵۰ گرمی اتیوپی', cat: 'دانه‌های تخصصی', price: '۳۸۵,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1610889556528-4c77b0e2e0e6?w=100&q=80' },
    { id: 5, name: 'موکاپات بیالتی ۶ کاپ', cat: 'تجهیزات کلاسیک', price: '۹۸۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&q=80' },
    { id: 6, name: 'دانه قهوه کلمبیا', cat: 'دانه‌های تخصصی', price: '۴۲۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100&q=80' },
    { id: 7, name: 'فرنچ پرس شیشه‌ای', cat: 'تجهیزات قهوه', price: '۶۵۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&q=80' },
    { id: 8, name: 'فیلتر کاغذی V60', cat: 'لوازم جانبی', price: '۹۵,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&q=80' }
];

// ===== Cart & Wishlist (localStorage) =====
let cart = JSON.parse(localStorage.getItem('plato_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('plato_wishlist') || '[]');

function saveCart() { localStorage.setItem('plato_cart', JSON.stringify(cart)); updateBadges(); }
function saveWishlist() { localStorage.setItem('plato_wishlist', JSON.stringify(wishlist)); updateBadges(); }

function updateBadges() {
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
    document.querySelectorAll('.wish-count').forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length ? 'flex' : 'none';
    });
}

function showToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
        t = document.createElement('div');
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== Search Overlay =====
function initSearch() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const openBtns = document.querySelectorAll('[data-search-open]');
    const closeBtn = document.querySelector('.search-close');

    if (!overlay) return;

    openBtns.forEach(btn => btn.addEventListener('click', () => {
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 100);
    }));

    function closeSearch() {
        overlay.classList.remove('active');
        input.value = '';
        results.innerHTML = '';
    }

    closeBtn?.addEventListener('click', closeSearch);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

    input?.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { results.innerHTML = ''; return; }

        const matched = PRODUCTS.filter(p =>
            p.name.includes(q) || p.cat.includes(q) || p.name.toLowerCase().includes(q)
        );

        if (!matched.length) {
            results.innerHTML = '<div class="search-empty">نتیجه‌ای یافت نشد ☕</div>';
            return;
        }

        results.innerHTML = matched.map(p => `
            <div class="search-result-item" onclick="location.href='shop.html'">
                <img src="${p.img}" alt="${p.name}">
                <div class="info">
                    <h4>${p.name}</h4>
                    <span>${p.cat} · ${p.price}</span>
                </div>
            </div>
        `).join('');
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('open');
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// ===== Wishlist buttons =====
function initWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (wishlist.includes(id)) {
            btn.classList.add('active');
            btn.querySelector('i').classList.replace('far', 'fas');
        }

        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const icon = btn.querySelector('i');
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(x => x !== id);
                btn.classList.remove('active');
                icon.classList.replace('fas', 'far');
                showToast('از علاقه‌مندی‌ها حذف شد');
            } else {
                wishlist.push(id);
                btn.classList.add('active');
                icon.classList.replace('far', 'fas');
                showToast('به علاقه‌مندی‌ها اضافه شد ❤️');
            }
            saveWishlist();
        });
    });
}

// ===== Add to cart =====
function initAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            const name = btn.dataset.name || 'محصول';
            cart.push({ id, name, time: Date.now() });
            saveCart();
            showToast(`${name} به سبد اضافه شد 🛒`);
        });
    });
}

// ===== Newsletter =====
function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input?.value) {
                showToast('عضویت شما با موفقیت ثبت شد ☕');
                input.value = '';
            }
        });
    });
}

// ===== Contact form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        showToast('پیام شما با موفقیت ارسال شد ✓');
        form.reset();
    });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    initSearch();
    initMobileMenu();
    initWishlist();
    initAddToCart();
    initNewsletter();
    initContactForm();
});
