/* ============================================
   ナカシマ工房 - メインJavaScript
   ============================================ */

'use strict';

// ── DOMContentLoaded ──
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initHeader();
  initHamburger();
  initScrollReveal();
  initCountUp();
  initGalleryFilter();
  initContactForm();
  initPageTop();
  initSmoothScroll();
});

/* ── ローディング ── */
function initLoading() {
  // ローディングオーバーレイを作成
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-logo">
      <span class="logo-jp">ナカシマ工房</span>
      <span class="logo-en">NAKASHIMA KOBO</span>
      <div class="loading-bar"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 1.5秒後に非表示
  setTimeout(() => {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 600);
  }, 1400);
}

/* ── ヘッダー（スクロール） ── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── ハンバーガーメニュー ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビリンクをクリックで閉じる
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // オーバーレイクリックで閉じる
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== hamburger) {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ── スクロールリビール ── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ── カウントアップ ── */
function initCountUp() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const animateCounter = (el, target, duration = 1800) => {
    let start = 0;
    const step = 16;
    const increment = target / (duration / step);

    const update = () => {
      start = Math.min(start + increment, target);
      el.textContent = Math.floor(start);
      if (start < target) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── ギャラリーフィルター ── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // ボタンアクティブ切替
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // アイテムフィルタリング
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          item.style.display = '';
          // 少し遅延してフェードイン
          setTimeout(() => {
            item.classList.remove('hiding');
          }, 10);
        } else {
          item.classList.add('hiding');
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

/* ── お問い合わせフォーム ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  // バリデーション設定
  const validators = {
    name: {
      el: form.querySelector('#name'),
      errorEl: form.querySelector('#nameError'),
      validate: (val) => val.trim() ? '' : 'お名前を入力してください'
    },
    email: {
      el: form.querySelector('#email'),
      errorEl: form.querySelector('#emailError'),
      validate: (val) => {
        if (!val.trim()) return 'メールアドレスを入力してください';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return '正しいメールアドレスを入力してください';
        return '';
      }
    },
    message: {
      el: form.querySelector('#message'),
      errorEl: form.querySelector('#messageError'),
      validate: (val) => val.trim() ? '' : 'お問い合わせ内容を入力してください'
    },
    privacy: {
      el: form.querySelector('#privacy'),
      errorEl: form.querySelector('#privacyError'),
      validate: (_, checked) => checked ? '' : 'プライバシーポリシーへの同意が必要です'
    }
  };

  // リアルタイムバリデーション
  Object.values(validators).forEach(({ el, errorEl, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const error = validate(el.value, el.type === 'checkbox' ? el.checked : undefined);
      showError(el, errorEl, error);
    });
  });

  // フォーム送信
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;

    Object.values(validators).forEach(({ el, errorEl, validate }) => {
      if (!el) return;
      const error = validate(el.value, el.type === 'checkbox' ? el.checked : undefined);
      showError(el, errorEl, error);
      if (error) hasError = true;
    });

    if (hasError) return;

    // 送信中状態
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    // GASへ送信
    const GAS_URL = 'YOUR_GAS_URL_HERE';
    const payload = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      type: form.querySelector('#inquiry-type').value,
      message: form.querySelector('#message').value
    };

    fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      form.style.display = 'none';
      formSuccess.style.display = 'flex';
      formSuccess.style.flexDirection = 'column';
      formSuccess.style.alignItems = 'center';
    }).catch(() => {
      alert('送信に失敗しました。もう一度お試しください。');
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    });
  });

  function showError(el, errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    el.classList.toggle('error', !!message);
  }
}

/* ── ページトップボタン ── */
function initPageTop() {
  const btn = document.getElementById('pageTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── スムーズスクロール ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}
