// ===================== INFORMÁTICA TOTAL — SCRIPT =====================
document.addEventListener('DOMContentLoaded', () => {

  /* Loader */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });

  /* Year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header on scroll */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });

  /* Cursor glow (desktop only) */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  } else {
    cursorGlow.style.display = 'none';
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Evergreen countdown (resets every 24h per visitor, persisted locally) */
  const cHours = document.getElementById('cHours');
  const cMinutes = document.getElementById('cMinutes');
  const cSeconds = document.getElementById('cSeconds');

  if (cHours && cMinutes && cSeconds) {
    const STORAGE_KEY = 'informaticatotal_deadline';
    const WINDOW_MS = 24 * 60 * 60 * 1000;
    let deadline = Number(localStorage.getItem(STORAGE_KEY));

    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + WINDOW_MS;
      try { localStorage.setItem(STORAGE_KEY, String(deadline)); } catch (e) { /* storage unavailable */ }
    }

    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        deadline = Date.now() + WINDOW_MS;
        try { localStorage.setItem(STORAGE_KEY, String(deadline)); } catch (e) { /* storage unavailable */ }
      }
      const remaining = Math.max(deadline - Date.now(), 0);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      cHours.textContent = pad(hours);
      cMinutes.textContent = pad(minutes);
      cSeconds.textContent = pad(seconds);
    };
    tick();
    setInterval(tick, 1000);
  }

});
