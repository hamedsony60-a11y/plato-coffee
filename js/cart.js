const CATALOG = {
  1: { name: 'آسیاب قهوه دستی', price: 1250000, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80', cat: 'تجهیزات قهوه', url: 'product-1.html' },
  2: { name: 'پیچر استیل ۶۰۰ میلی', price: 480000, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80', cat: 'تجهیزات باریستا', url: 'product-2.html' },
  3: { name: 'اسپرسوساز دلونگی', price: 12900000, img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&q=80', cat: 'ماشین‌های قهوه', url: 'product-3.html' },
  4: { name: 'دانه قهوه اتیوپی', price: 385000, img: 'https://images.unsplash.com/photo-1610889556528-4c77b0e2e0e6?w=200&q=80', cat: 'دانه‌های تخصصی', url: 'product-4.html' },
  5: { name: 'موکاپات بیالتی ۶ کاپ', price: 980000, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=80', cat: 'تجهیزات کلاسیک', url: 'product-5.html' },
  6: { name: 'دانه قهوه کلمبیا', price: 420000, img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&q=80', cat: 'دانه‌های تخصصی', url: 'product-6.html' },
  7: { name: 'فرنچ پرس شیشه‌ای', price: 650000, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&q=80', cat: 'تجهیزات قهوه', url: 'product-7.html' },
  8: { name: 'فیلتر کاغذی V60', price: 95000, img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=200&q=80', cat: 'لوازم جانبی', url: 'product-8.html' }
};
const GATEWAY_NAMES = { zarinpal: 'زرین‌پال', idpay: 'آیدی‌پی', nextpay: 'نکست‌پی', payping: 'پی‌پینگ' };
function toFa(n) { return n.toLocaleString('fa-IR'); }
function getCartRaw() { try { return JSON.parse(localStorage.getItem('plato_cart') || '[]'); } catch { return []; } }
function saveCartRaw(items) {
  localStorage.setItem('plato_cart', JSON.stringify(items));
  try { cart.length = 0; items.forEach(i => cart.push(i)); } catch(e) {}
  if (typeof updateBadges === 'function') updateBadges();
  else document.querySelectorAll('.cart-count').forEach(el => el.textContent = items.length);
}
function getAggregated() {
  const raw = getCartRaw(); const map = {};
  raw.forEach(item => { const id = String(item.id); if (!map[id]) map[id] = { id, qty: 0 }; map[id].qty += 1; });
  return Object.values(map);
}
function setQty(id, qty) {
  let raw = getCartRaw().filter(i => String(i.id) !== String(id));
  const info = CATALOG[id] || { name: 'محصول' };
  for (let i = 0; i < qty; i++) raw.push({ id: String(id), name: info.name, time: Date.now() });
  saveCartRaw(raw); renderCart();
}
function removeItem(id) {
  saveCartRaw(getCartRaw().filter(i => String(i.id) !== String(id)));
  renderCart();
  if (typeof showToast === 'function') showToast('محصول از سبد حذف شد');
}
function clearCart() { saveCartRaw([]); renderCart(); if (typeof showToast === 'function') showToast('سبد خرید خالی شد'); }
let discount = 0;
function calcTotals() {
  const items = getAggregated(); let sub = 0;
  items.forEach(it => { const p = CATALOG[it.id]; if (p) sub += p.price * it.qty; });
  return { sub, total: Math.max(0, sub - discount), items };
}
function renderCart() {
  const list = document.getElementById('cartItemsList');
  const countEl = document.getElementById('cartItemCount');
  const goBtn = document.getElementById('goCheckout');
  if (!list) return;
  const { sub, total, items } = calcTotals();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;
  if (!items.length) {
    list.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>سبد خرید شما خالی است</p><a href="shop.html" class="btn btn-primary">مشاهده فروشگاه</a></div>';
    if (goBtn) goBtn.disabled = true;
  } else {
    list.innerHTML = items.map(it => {
      const p = CATALOG[it.id] || { name: 'محصول', price: 0, img: '', cat: '', url: 'shop.html' };
      return `<div class="cart-item">
        <div class="cart-item-img"><a href="${p.url}"><img src="${p.img}" alt="${p.name}"></a></div>
        <div class="cart-item-info"><h3><a href="${p.url}">${p.name}</a></h3><div class="cat">${p.cat}</div><div class="unit-price">${toFa(p.price)} تومان</div></div>
        <div class="cart-item-qty"><button type="button" data-minus="${it.id}">−</button><span>${it.qty}</span><button type="button" data-plus="${it.id}">+</button></div>
        <div style="display:flex;align-items:center;gap:8px"><div class="cart-item-total">${toFa(p.price * it.qty)} ت</div>
        <button class="cart-item-remove" data-remove="${it.id}"><i class="fas fa-trash-alt"></i></button></div></div>`;
    }).join('');
    if (goBtn) goBtn.disabled = false;
    list.querySelectorAll('[data-plus]').forEach(btn => btn.addEventListener('click', () => {
      const cur = getAggregated().find(x => String(x.id) === String(btn.dataset.plus));
      setQty(btn.dataset.plus, (cur ? cur.qty : 0) + 1);
    }));
    list.querySelectorAll('[data-minus]').forEach(btn => btn.addEventListener('click', () => {
      const cur = getAggregated().find(x => String(x.id) === String(btn.dataset.minus));
      const q = (cur ? cur.qty : 1) - 1;
      if (q <= 0) removeItem(btn.dataset.minus); else setQty(btn.dataset.minus, q);
    }));
    list.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => removeItem(btn.dataset.remove)));
  }
  const subEl = document.getElementById('subtotalText');
  const totalEl = document.getElementById('totalText');
  const discRow = document.getElementById('discountRow');
  const discText = document.getElementById('discountText');
  if (subEl) subEl.textContent = toFa(sub) + ' تومان';
  if (totalEl) totalEl.textContent = toFa(total) + ' تومان';
  if (discRow) { if (discount > 0) { discRow.style.display = 'flex'; if (discText) discText.textContent = '−' + toFa(discount) + ' تومان'; } else discRow.style.display = 'none'; }
}
function renderCheckoutSummary() {
  const { sub, total, items } = calcTotals();
  const box = document.getElementById('checkoutItemsSummary');
  if (box) box.innerHTML = items.map(it => { const p = CATALOG[it.id] || { name: 'محصول', price: 0 }; return `<div class="summary-row"><span>${p.name} × ${it.qty}</span><span>${toFa(p.price * it.qty)} ت</span></div>`; }).join('');
  const coSub = document.getElementById('coSubtotal');
  const coTot = document.getElementById('coTotal');
  const coDiscRow = document.getElementById('coDiscountRow');
  const coDisc = document.getElementById('coDiscount');
  if (coSub) coSub.textContent = toFa(sub) + ' تومان';
  if (coTot) coTot.textContent = toFa(total) + ' تومان';
  if (coDiscRow) { if (discount > 0) { coDiscRow.style.display = 'flex'; if (coDisc) coDisc.textContent = '−' + toFa(discount) + ' تومان'; } else coDiscRow.style.display = 'none'; }
}
function showCheckout() {
  if (!getAggregated().length) return;
  document.getElementById('cartSection').classList.add('hidden');
  document.getElementById('checkoutSection').classList.add('active');
  renderCheckoutSummary();
  try { const u = JSON.parse(localStorage.getItem('plato_user') || 'null'); if (u && u.name) document.getElementById('fullName').value = u.name; } catch(e) {}
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showCart() {
  document.getElementById('cartSection').classList.remove('hidden');
  document.getElementById('checkoutSection').classList.remove('active');
  renderCart(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function processPayment() {
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const address = document.getElementById('address').value.trim();
  if (!name || !phone || !city || !address) { if (typeof showToast === 'function') showToast('لطفاً اطلاعات گیرنده را کامل وارد کنید'); return; }
  const gw = document.querySelector('input[name="gateway"]:checked');
  const gwKey = gw ? gw.value : 'zarinpal';
  const gwName = GATEWAY_NAMES[gwKey] || 'درگاه پرداخت';
  const { total } = calcTotals();
  const orderId = 'PL-' + Date.now().toString().slice(-8);
  const overlay = document.getElementById('payOverlay');
  const icon = document.getElementById('payIcon');
  const title = document.getElementById('payTitle');
  const msg = document.getElementById('payMsg');
  const code = document.getElementById('orderCode');
  const doneBtn = document.getElementById('payDoneBtn');
  overlay.classList.add('active');
  icon.className = 'pay-icon loading'; icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  title.textContent = 'در حال اتصال به ' + gwName + '...';
  msg.textContent = 'لطفاً صبر کنید. در حال انتقال به درگاه امن بانکی.';
  code.style.display = 'none'; doneBtn.style.display = 'none';
  setTimeout(() => { title.textContent = 'تأیید پرداخت در ' + gwName; msg.textContent = 'مبلغ ' + toFa(total) + ' تومان در حال پردازش است...'; }, 1200);
  setTimeout(() => {
    icon.className = 'pay-icon success'; icon.innerHTML = '<i class="fas fa-check"></i>';
    title.textContent = 'پرداخت موفق!';
    msg.textContent = 'سفارش شما با موفقیت ثبت شد و به‌زودی ارسال می‌شود.';
    code.style.display = 'block'; code.textContent = 'کد پیگیری: ' + orderId;
    doneBtn.style.display = 'inline-flex';
    const orders = JSON.parse(localStorage.getItem('plato_orders') || '[]');
    orders.push({ id: orderId, total, gateway: gwName, name, phone, city, address, items: getAggregated(), time: Date.now() });
    localStorage.setItem('plato_orders', JSON.stringify(orders));
    saveCartRaw([]); discount = 0;
  }, 2800);
}
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('clearCartBtn')?.addEventListener('click', () => { if (getAggregated().length && confirm('سبد خرید خالی شود؟')) clearCart(); });
  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const code = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
    const { sub } = calcTotals();
    if (code === 'PLATO10') { discount = Math.round(sub * 0.1); if (typeof showToast === 'function') showToast('کد تخفیف ۱۰٪ اعمال شد ✓'); }
    else if (code === 'COFFEE20') { discount = Math.round(sub * 0.2); if (typeof showToast === 'function') showToast('کد تخفیف ۲۰٪ اعمال شد ✓'); }
    else { discount = 0; if (typeof showToast === 'function') showToast('کد تخفیف نامعتبر است'); }
    renderCart();
  });
  document.getElementById('goCheckout')?.addEventListener('click', showCheckout);
  document.getElementById('backToCart')?.addEventListener('click', showCart);
  document.getElementById('payBtn')?.addEventListener('click', processPayment);
  document.querySelectorAll('.gateway-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.gateway-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = card.querySelector('input'); if (input) input.checked = true;
    });
  });
});
