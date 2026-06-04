/* =========================================================
   RENOVA LP — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- hero fade-in on load ---------- */
  const hero = document.getElementById('hero');
  window.addEventListener('load', () => hero && hero.classList.add('is-loaded'));
  // fallback in case load already fired
  if (document.readyState === 'complete' && hero) hero.classList.add('is-loaded');

  /* ---------- HERO slider (2-pattern dynamic KV) ---------- */
  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  const dots   = Array.from(document.querySelectorAll('#heroIndicator button'));
  let current  = 0;
  let timer    = null;
  const INTERVAL = 5500;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }
  function next() { goTo(current + 1); }
  function startTimer() { stopTimer(); if (slides.length > 1) timer = setInterval(next, INTERVAL); }
  function stopTimer() { if (timer) clearInterval(timer); }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startTimer(); }));
  startTimer();

  /* ---------- header scroll state ---------- */
  const header  = document.getElementById('header');
  const pagetop = document.getElementById('pagetop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 60);
    pagetop.classList.toggle('is-show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const body = document.body;
  function closeMenu() {
    body.classList.remove('is-menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', () => {
    const open = body.classList.toggle('is-menu-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------- smooth scroll with header offset ---------- */
  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = header.offsetHeight - 1;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    });
  });

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- form (demo) ---------- */
  const form = document.querySelector('.contact__form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('お問い合わせありがとうございます。\n（デモ：実際の送信先は本番環境で設定してください）');
    });
  }
})();
