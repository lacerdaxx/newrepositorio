// ===================== ACELERADOR 6D — SCRIPT =====================
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

  /* Animated counters (supports data-prefix, e.g. "R$ ") */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = prefix + value.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('pt-BR');
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* Testimonials slider */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (track && dotsWrap) {
    const slides = track.children.length;
    let current = 0;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll('span');

    function goTo(index) {
      current = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    let autoplay = setInterval(() => goTo((current + 1) % slides), 5000);
    dotsWrap.addEventListener('mouseenter', () => clearInterval(autoplay));
    dotsWrap.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo((current + 1) % slides), 5000);
    });
  }

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

  /* Modules accordion (first one open by default) */
  const moduleItems = document.querySelectorAll('.module-item');
  moduleItems.forEach(item => {
    const question = item.querySelector('.module-question');
    const answer = item.querySelector('.module-answer');
    if (item.classList.contains('active')) {
      requestAnimationFrame(() => { answer.style.maxHeight = answer.scrollHeight + 'px'; });
    }
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      moduleItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.module-answer').style.maxHeight = null;
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
    const STORAGE_KEY = 'acelerador6d_deadline';
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

  /* WhatsApp phone mask */
  const whatsappInput = document.getElementById('whatsappInput');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', () => {
      let v = whatsappInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
      whatsappInput.value = v.trim();
    });
  }

  /* Lead form validation + fake submit */
  const leadForm = document.getElementById('leadForm');
  const toast = document.getElementById('toast');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      leadForm.querySelectorAll('.form-row').forEach(row => {
        const input = row.querySelector('input');
        if (!input) return;
        input.classList.add('touched');
        const isEmpty = input.hasAttribute('required') && !input.value.trim();
        const isBadEmail = input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        const isBadPhone = input.type === 'tel' && input.value.replace(/\D/g, '').length < 10;

        if (isEmpty || isBadEmail || isBadPhone) {
          row.classList.add('error');
          valid = false;
        } else {
          row.classList.remove('error');
        }
      });

      const consent = leadForm.querySelector('input[type="checkbox"]');
      if (consent && !consent.checked) {
        valid = false;
        consent.closest('.checkbox-row').style.color = '#ff8080';
      } else if (consent) {
        consent.closest('.checkbox-row').style.color = '';
      }

      if (!valid) return;

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      submitBtn.disabled = true;
      btnText.textContent = 'Enviando...';

      setTimeout(() => {
        btnText.textContent = originalText;
        submitBtn.disabled = false;
        leadForm.reset();
        leadForm.querySelectorAll('.form-row').forEach(row => row.classList.remove('error'));

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }, 900);
    });
  }

});
