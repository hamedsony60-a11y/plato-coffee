// ===== Products data for search =====
const PRODUCTS = [
    { id: 1, name: 'آسیاب قهوه دستی', cat: 'تجهیزات قهوه', price: '۱,۲۵۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&q=80', url: 'product-1.html' },
    { id: 2, name: 'پیچر استیل ۶۰۰ میلی', cat: 'تجهیزات باریستا', price: '۴۸۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80', url: 'product-2.html' },
    { id: 3, name: 'اسپرسوساز دلونگی', cat: 'ماشین‌های قهوه', price: '۱۲,۹۰۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100&q=80', url: 'product-3.html' },
    { id: 4, name: 'دانه قهوه ۲۵۰ گرمی اتیوپی', cat: 'دانه‌های تخصصی', price: '۳۸۵,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1610889556528-4c77b0e2e0e6?w=100&q=80', url: 'product-4.html' },
    { id: 5, name: 'موکاپات بیالتی ۶ کاپ', cat: 'تجهیزات کلاسیک', price: '۹۸۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&q=80', url: 'product-5.html' },
    { id: 6, name: 'دانه قهوه کلمبیا', cat: 'دانه‌های تخصصی', price: '۴۲۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100&q=80', url: 'product-6.html' },
    { id: 7, name: 'فرنچ پرس شیشه‌ای', cat: 'تجهیزات قهوه', price: '۶۵۰,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&q=80', url: 'product-7.html' },
    { id: 8, name: 'فیلتر کاغذی V60', cat: 'لوازم جانبی', price: '۹۵,۰۰۰ تومان', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&q=80', url: 'product-8.html' }
];

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
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}

function getUser() { try { return JSON.parse(localStorage.getItem('plato_user') || 'null'); } catch { return null; } }
function setUser(user) { if (user) localStorage.setItem('plato_user', JSON.stringify(user)); else localStorage.removeItem('plato_user'); }
function isLoggedIn() { return !!getUser(); }

function updateUserUI() {
    const user = getUser();
    document.querySelectorAll('[data-user-area]').forEach(el => {
        if (user) {
            el.innerHTML = `<a href="account.html" class="icon-btn" title="${user.name}" style="gap:4px;width:auto;padding:0 8px"><i class="fas fa-user"></i><span class="header-user-name">${user.name.split(' ')[0]}</span></a>`;
        } else {
            el.innerHTML = `<a href="login.html" class="icon-btn" aria-label="حساب کاربری"><i class="far fa-user"></i></a>`;
        }
    });
}

function initSearch() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const openBtns = document.querySelectorAll('[data-search-open]');
    const closeBtn = document.querySelector('.search-close');
    if (!overlay) return;
    openBtns.forEach(btn => btn.addEventListener('click', () => { overlay.classList.add('active'); setTimeout(() => input && input.focus(), 100); }));
    function closeSearch() { overlay.classList.remove('active'); if (input) input.value = ''; if (results) results.innerHTML = ''; }
    closeBtn?.addEventListener('click', closeSearch);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
    input?.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { results.innerHTML = ''; return; }
        const matched = PRODUCTS.filter(p => p.name.includes(q) || p.cat.includes(q));
        if (!matched.length) { results.innerHTML = '<div class="search-empty">نتیجه‌ای یافت نشد ☕</div>'; return; }
        results.innerHTML = matched.map(p => {
            const url = p.url || 'shop.html';
            return `<div class="search-result-item" onclick="location.href='${url}'"><img src="${p.img}" alt="${p.name}"><div class="info"><h4>${p.name}</h4><span>${p.cat} · ${p.price}</span></div></div>`;
        }).join('');
    });
}

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

function initWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (wishlist.includes(id)) { btn.classList.add('active'); btn.querySelector('i')?.classList.replace('far', 'fas'); }
        btn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            const icon = btn.querySelector('i');
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(x => x !== id);
                btn.classList.remove('active');
                icon?.classList.replace('fas', 'far');
                showToast('از علاقه‌مندی‌ها حذف شد');
            } else {
                wishlist.push(id);
                btn.classList.add('active');
                icon?.classList.replace('far', 'fas');
                showToast('به علاقه‌مندی‌ها اضافه شد ❤️');
            }
            saveWishlist();
        });
    });
}

function initAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            const id = btn.dataset.id;
            const name = btn.dataset.name || 'محصول';
            cart.push({ id, name, time: Date.now() });
            saveCart();
            showToast(`${name} به سبد اضافه شد 🛒`);
        });
    });
}

function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input?.value) { showToast('عضویت شما با موفقیت ثبت شد ☕'); input.value = ''; }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => { e.preventDefault(); showToast('پیام شما با موفقیت ارسال شد ✓'); form.reset(); });
}

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPass').value;
            const err = document.getElementById('loginError');
            const users = JSON.parse(localStorage.getItem('plato_users') || '[]');
            const found = users.find(u => u.email === email && u.pass === pass);
            if (found) {
                setUser({ name: found.name, email: found.email });
                showToast('ورود موفق! خوش آمدید ☕');
                setTimeout(() => location.href = 'account.html', 800);
            } else if (err) { err.textContent = 'ایمیل یا رمز عبور اشتباه است'; err.classList.add('show'); }
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const pass = document.getElementById('regPass').value;
            const pass2 = document.getElementById('regPass2').value;
            const err = document.getElementById('regError');
            if (pass !== pass2) { if (err) { err.textContent = 'رمز عبور و تکرار آن یکسان نیستند'; err.classList.add('show'); } return; }
            if (pass.length < 4) { if (err) { err.textContent = 'رمز عبور حداقل ۴ کاراکتر باشد'; err.classList.add('show'); } return; }
            let users = JSON.parse(localStorage.getItem('plato_users') || '[]');
            if (users.find(u => u.email === email)) { if (err) { err.textContent = 'این ایمیل قبلاً ثبت شده است'; err.classList.add('show'); } return; }
            users.push({ name, email, pass });
            localStorage.setItem('plato_users', JSON.stringify(users));
            setUser({ name, email });
            showToast('ثبت‌نام موفق! خوش آمدید ☕');
            setTimeout(() => location.href = 'account.html', 800);
        });
    }
    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            setUser(null);
            showToast('با موفقیت خارج شدید');
            setTimeout(() => location.href = 'index.html', 700);
        });
    });
}

function protectAccountPage() {
    if (location.pathname.includes('account.html') || document.body.dataset.page === 'account') {
        if (!isLoggedIn()) location.href = 'login.html';
        else {
            const user = getUser();
            document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
            document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = user.email);
            document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cart.length);
            document.querySelectorAll('[data-wish-count]').forEach(el => el.textContent = wishlist.length);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    updateUserUI();
    initSearch();
    initMobileMenu();
    initWishlist();
    initAddToCart();
    initNewsletter();
    initContactForm();
    initAuthForms();
    protectAccountPage();
    document.querySelectorAll('.cart-btn').forEach(btn => {
        if (btn.tagName === 'A') return;
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', e => { e.preventDefault(); location.href = 'cart.html'; });
    });
});
