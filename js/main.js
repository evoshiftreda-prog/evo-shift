/* EVO SHIFT — Main JavaScript
   Auto-discovers files from /videos/ and /logos/ folders
   Just drop files in — no renaming, no code changes. */

'use strict';

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  const c = document.querySelector('.cursor');
  const f = document.querySelector('.cursor-follower');
  if (!c || !f) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; c.style.left = mx+'px'; c.style.top = my+'px'; });
  (function anim() { fx += (mx-fx)*0.12; fy += (my-fy)*0.12; f.style.left = fx+'px'; f.style.top = fy+'px'; requestAnimationFrame(anim); })();
  document.querySelectorAll('a,button,.portfolio-card,.service-card,.brand-logo-item').forEach(el => {
    el.addEventListener('mouseenter', () => f.classList.add('hover'));
    el.addEventListener('mouseleave', () => f.classList.remove('hover'));
  });
})();

/* ─── PAGE LOADER ─── */
(function initLoader() {
  const loader = document.querySelector('.loader');
  const progress = document.querySelector('.loader-progress');
  if (!loader || !progress) return;
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random()*18+5;
    if (p >= 100) { p = 100; progress.style.width='100%'; clearInterval(iv);
      setTimeout(() => { loader.classList.add('hidden'); initScrollAnimations(); }, 600); }
    else { progress.style.width = p+'%'; }
  }, 120);
})();

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    const obs = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
  });
}

/* ─── SCROLL PROGRESS BAR ─── */
(function initProgressBar() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = ((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) + '%';
  }, { passive: true });
})();

/* ─── NAV ─── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });
})();

/* ─── MOBILE NAV ─── */
(function initMobileNav() {
  const burger = document.querySelector('.nav-burger');
  const links  = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open'); links.classList.remove('open'); document.body.style.overflow = '';
    });
  });
})();

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
  });
});

/* ─── BRAND LOGOS — auto-load ALL images from /logos/ ─── */
(function initBrandLogos() {
  const track1 = document.querySelector('.marquee-track');
  const track2 = document.querySelector('.marquee-track--reverse');
  if (!track1 && !track2) return;
  fetch('logos/').then(r => r.text()).then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const files = [...doc.querySelectorAll('a')].map(a => a.href).filter(h => /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(h));
    const names = files.map(url => url.split('/').pop().replace(/\.(png|jpg|jpeg|svg|webp|gif)$/i, ''));
    function buildRow() {
      return names.map((name, i) => {
        const ext = files[i].split('.').pop();
        return `<div class="brand-logo-item"><img src="${files[i]}" alt="${name}" onerror="this.parentElement.innerHTML='<span class=brand-logo-fallback>${name.toUpperCase()}</span>'"><span class="brand-logo-fallback" style="display:none">${name.toUpperCase()}</span></div>`;
      }).join('');
    }
    const row = buildRow();
    if (track1) track1.innerHTML = row + row;
    if (track2) track2.innerHTML = row + row;
  }).catch(() => {});
})();

/* ─── PORTFOLIO — auto-load ALL videos from /videos/ ─── */
(function initPortfolio() {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;
  fetch('videos/').then(r => r.text()).then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const files = [...doc.querySelectorAll('a')].map(a => a.href).filter(h => /\.mp4$/i.test(h));
    if (!files.length) return;
    grid.innerHTML = '';
    files.forEach((src, i) => {
      const name = src.split('/').pop().replace('.mp4', '').replace(/-/g, ' ');
      const tag = name.split(' ')[0].toUpperCase();
      const wide = i === 0 ? ' portfolio-card--wide' : '';
      const card = document.createElement('div');
      card.className = `portfolio-card${wide}`;
      card.innerHTML = `
        <div class="portfolio-card-img">
          <video class="portfolio-video" src="${src}" muted loop preload="none" playsinline></video>
          <div class="portfolio-card-overlay">
            <div class="overlay-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
            <h3>${name}</h3>
            <p>${tag}</p>
          </div>
        </div>
        <div class="portfolio-card-info">
          <span class="portfolio-tag">${tag}</span>
          <h4>${name}</h4>
        </div>`;
      const v = card.querySelector('video');
      const img = card.querySelector('.portfolio-card-img');
      img.addEventListener('mouseenter', () => { v.setAttribute('preload', 'auto'); v.play(); });
      img.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
      v.addEventListener('canplay', () => v.classList.add('loaded'));
      grid.appendChild(card);
    });
  }).catch(() => {});
})();

/* ─── CONTACT FORM ─── */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    btn.textContent = 'SENDING…';
    btn.disabled = true;
    setTimeout(() => {
      form.innerHTML = '<p style="font-family:var(--font-serif);font-size:1.4rem;color:var(--gold);text-align:center">Message sent! We\'ll be in touch soon.</p>';
    }, 1200);
  });
})();