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

const BRAND_LOGOS = [
  'logos/logo1.png',
  'logos/logo2.png',
  'logos/logo3.png',
  'logos/logo4.png'
];

(function initBrandLogos() {
  const track1 = document.querySelector('.marquee-track');
  const track2 = document.querySelector('.marquee-track--reverse');

  if (!track1 && !track2) return;

  const row = BRAND_LOGOS.map(src => `
    <div class="brand-logo-item">
      <img src="${src}" alt="Brand Logo">
    </div>
  `).join('');

  if (track1) track1.innerHTML = row + row;
  if (track2) track2.innerHTML = row + row;
})();

const PORTFOLIO_VIDEOS = [
  'videos/project1.mp4',
  'videos/project2.mp4',
  'videos/project3.mp4'
];

(function initPortfolio() {

  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  grid.innerHTML = '';

  PORTFOLIO_VIDEOS.forEach((src, i) => {

    const card = document.createElement('div');
    card.className = `portfolio-card${i === 0 ? ' portfolio-card--wide' : ''}`;

    card.innerHTML = `
      <div class="portfolio-card-img">
        <video class="portfolio-video"
          src="${src}"
          muted
          loop
          playsinline
          preload="metadata"></video>

        <div class="portfolio-card-overlay">
          <div class="overlay-play">▶</div>
        </div>
      </div>
    `;

    const video = card.querySelector('video');

    card.addEventListener('mouseenter', () => {
      video.play().catch(()=>{});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    grid.appendChild(card);
  });

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
