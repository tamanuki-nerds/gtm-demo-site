// ===== カート状態管理 =====
const Cart = {
  items: JSON.parse(localStorage.getItem('gtm_demo_cart') || '[]'),
  save() { localStorage.setItem('gtm_demo_cart', JSON.stringify(this.items)); },
  add(product) {
    const existing = this.items.find(i => i.id === product.id && i.size === product.size);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
    this.updateBadge();
  },
  remove(id, size) {
    this.items = this.items.filter(i => !(i.id === id && i.size === size));
    this.save();
    this.updateBadge();
  },
  updateQty(id, size, qty) {
    const item = this.items.find(i => i.id === id && i.size === size);
    if (item) { item.qty = qty; this.save(); this.updateBadge(); }
  },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  updateBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) { badge.textContent = this.count(); badge.style.display = this.count() > 0 ? 'flex' : 'none'; }
  }
};

// ===== dataLayer ヘルパー =====
// GTMに渡すカスタムイベントを送出する共通関数
window.dataLayer = window.dataLayer || [];
function pushEvent(eventName, params) {
  window.dataLayer.push({ event: eventName, ...params });
}

// ===== ページ初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();

  const page = document.body.dataset.page;
  if (page === 'index')    initIndex();
  if (page === 'products') initProducts();
  if (page === 'product')  initProduct();
  if (page === 'cart')     initCart();
  if (page === 'thanks')   initThanks();
  if (page === 'contact')  initContact();
});

// ===== トップページ =====
function initIndex() {
  // 注目商品は先頭4件だけ表示
  renderProducts(PRODUCTS.slice(0, 4));

  // ヒーローバナーCTAクリック → 課題3のクリック計測練習対象
  document.querySelector('.btn-hero')?.addEventListener('click', () => {
    pushEvent('hero_cta_click', { button_text: '今すぐ見る' });
  });
}

// ===== 商品一覧ページ =====
const PRODUCTS = [
  { id: 1, name: 'オーバーサイズTシャツ',  price: 4400,  emoji: '👕', category: 'tops',     desc: '上質なコットン素材を使用したゆったりシルエットのTシャツ。' },
  { id: 2, name: 'リラックスデニムパンツ', price: 9900,  emoji: '👖', category: 'bottoms',  desc: 'やや低めのライズとゆとりのあるシルエットが特徴のデニム。' },
  { id: 3, name: 'ロングスリーブカットソー', price: 5500, emoji: '👔', category: 'tops',    desc: '年間を通して活躍するベーシックなロングスリーブ。' },
  { id: 4, name: 'チェックシャツ',         price: 7700,  emoji: '🧣', category: 'tops',     desc: 'ネルチェックのシャツ。カジュアルスタイルに最適。' },
  { id: 5, name: 'テーパードスラックス',   price: 11000, emoji: '👗', category: 'bottoms',  desc: 'センタープレスが入ったスマートなテーパードシルエット。' },
  { id: 6, name: 'キャンバストートバッグ', price: 3300,  emoji: '👜', category: 'acc',      desc: 'A4サイズが入るキャンバス地のトートバッグ。' },
  { id: 7, name: 'リブニットビーニー',     price: 2200,  emoji: '🧢', category: 'acc',      desc: '細リブのコンパクトなビーニー。サイズ調整可能。' },
  { id: 8, name: 'スウェットパーカー',     price: 8800,  emoji: '🧥', category: 'tops',     desc: '裏起毛のあたたかいスウェットパーカー。フロントポケット付き。' },
];

function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = list.map(p => `
    <a href="product.html?id=${p.id}" class="product-card" data-product-id="${p.id}" data-product-name="${p.name}" data-product-price="${p.price}">
      <div class="thumb">${p.emoji}</div>
      <div class="info">
        <span class="category-badge">${categoryLabel(p.category)}</span>
        <div class="name">${p.name}</div>
        <div class="price">¥${p.price.toLocaleString()}</div>
      </div>
    </a>`).join('');

  // 商品カードクリック → 課題3「クリックの計測」練習対象
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      pushEvent('product_click', {
        product_id:   card.dataset.productId,
        product_name: card.dataset.productName,
        product_price: Number(card.dataset.productPrice)
      });
    });
  });
}

function categoryLabel(c) {
  return { tops: 'トップス', bottoms: 'ボトムス', acc: 'アクセサリー' }[c] || c;
}

function initProducts() {
  renderProducts(PRODUCTS);

  // カテゴリフィルター → 課題3「クリックの計測」練習対象
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
      renderProducts(filtered);
      // dataLayerにフィルタークリックを送出
      pushEvent('filter_click', { filter_category: cat });
    });
  });
}

// ===== 商品詳細ページ =====
function initProduct() {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  document.getElementById('productEmoji').textContent      = product.emoji;
  document.getElementById('productName').textContent       = product.name;
  document.getElementById('productBreadcrumb').textContent = product.name;
  document.getElementById('productPrice').textContent      = `¥${product.price.toLocaleString()}`;
  document.getElementById('productDesc').textContent     = product.desc;
  document.title = `${product.name} | STYLE DEMO`;

  // サムネイルクリック（課題3の練習対象）
  document.querySelectorAll('.thumb-item').forEach((t, i) => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.thumb-item').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('productEmoji').textContent = t.textContent;
      pushEvent('image_click', { product_id: product.id, thumb_index: i + 1 });
    });
  });

  // サイズ選択
  let selectedSize = '';
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
      pushEvent('size_select', { product_id: product.id, size: selectedSize });
    });
  });

  // カートに追加 → 課題3「dataLayerカスタムイベント」の核心
  document.getElementById('btnAddToCart')?.addEventListener('click', () => {
    if (!selectedSize) { alert('サイズを選択してください'); return; }
    Cart.add({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, size: selectedSize });

    // 【課題3 + GTMカスタムイベント】
    // GTMでカスタムイベント "add_to_cart" を受け取り、dataLayer変数で値を取得する
    pushEvent('add_to_cart', {
      product_id:    product.id,
      product_name:  product.name,
      product_price: product.price,
      selected_size: selectedSize
    });

    const btn = document.getElementById('btnAddToCart');
    btn.textContent = '✓ カートに追加しました';
    btn.style.background = '#38a169';
    setTimeout(() => { btn.textContent = 'カートに追加'; btn.style.background = ''; }, 2000);
  });
}

// ===== カートページ =====
function initCart() {
  renderCart();

  // 購入手続きへボタン（renderCart呼び出しのたびに重複登録しないよう、ここで1回だけ登録）
  document.getElementById('btnCheckout')?.addEventListener('click', () => {
    const subtotal = Cart.total();
    const shipping  = subtotal >= 10000 ? 0 : 550;
    const total     = subtotal + shipping;
    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    localStorage.setItem('gtm_demo_order', JSON.stringify({ orderId, total, items: Cart.items }));
    // 購入確定: カートをクリア
    Cart.items = [];
    Cart.save();
    location.href = 'thanks.html';
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const summaryEl  = document.getElementById('cartSummary');
  if (!container) return;

  if (Cart.items.length === 0) {
    container.innerHTML = '<div class="empty-cart">カートに商品がありません</div>';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  container.innerHTML = Cart.items.map(item => `
    <div class="cart-item">
      <div class="item-thumb">${item.emoji}</div>
      <div class="item-body">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">サイズ: ${item.size}</div>
        <div class="item-price">¥${(item.price * item.qty).toLocaleString()}</div>
        <div class="qty-control">
          <button class="qty-btn" data-action="minus" data-id="${item.id}" data-size="${item.size}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="plus"  data-id="${item.id}" data-size="${item.size}">＋</button>
        </div>
      </div>
      <button class="btn-delete" data-id="${item.id}" data-size="${item.size}" title="削除">×</button>
    </div>`).join('');

  // 小計・合計表示
  const subtotal  = Cart.total();
  const shipping  = subtotal >= 10000 ? 0 : 550;
  const total     = subtotal + shipping;
  document.getElementById('subtotalPrice').textContent  = `¥${subtotal.toLocaleString()}`;
  document.getElementById('shippingPrice').textContent  = shipping === 0 ? '無料' : `¥${shipping.toLocaleString()}`;
  document.getElementById('totalPrice').textContent     = `¥${total.toLocaleString()}`;

  // 数量操作
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { action, id, size } = btn.dataset;
      const item = Cart.items.find(i => i.id === Number(id) && i.size === size);
      if (!item) return;
      const newQty = action === 'plus' ? item.qty + 1 : item.qty - 1;
      if (newQty < 1) return;
      Cart.updateQty(Number(id), size, newQty);
      renderCart();
    });
  });

  // 削除
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, size } = btn.dataset;
      pushEvent('remove_from_cart', { product_id: Number(id), size });
      Cart.remove(Number(id), size);
      renderCart();
    });
  });

}

// ===== 購入完了ページ =====
function initThanks() {
  const order = JSON.parse(localStorage.getItem('gtm_demo_order') || '{}');
  const orderId = order.orderId || 'ORD-DEMO1';
  const total   = order.total   || 0;

  document.getElementById('orderId').textContent    = orderId;
  document.getElementById('orderTotal').textContent = total ? `¥${total.toLocaleString()}` : '';

  // 【課題2で確認】purchase イベントをdataLayerに送出
  // GTMでは URL に "thanks.html" が含まれるトリガーで発火させる
  pushEvent('purchase', {
    transaction_id: orderId,
    value:          total,
    currency:       'JPY',
    items:          (order.items || []).map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))
  });
}

// ===== お問い合わせページ =====
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let hasError = false;

    // 簡易バリデーション
    ['name', 'email', 'message'].forEach(field => {
      const input = document.getElementById(field);
      const errEl = document.getElementById(`err_${field}`);
      if (!input || !errEl) return;
      if (!input.value.trim()) {
        errEl.classList.add('visible');
        hasError = true;
      } else {
        errEl.classList.remove('visible');
      }
    });

    if (hasError) {
      // バリデーションエラー発生 → dataLayerに送出
      pushEvent('form_validation_error', { form_id: 'contactForm' });
      return;
    }

    // 【課題6】フォーム送信成功 → GTMのフォーム送信トリガーか、このカスタムイベントで計測
    pushEvent('form_submit', {
      form_id:      'contactForm',
      inquiry_type: document.getElementById('inquiry_type')?.value || ''
    });

    // 送信完了表示
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  });
}
