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

  /* Evergreen countdown (resets a few minutes after expiring, persisted locally) */
  const countdownWrap = document.getElementById('countdownWrap');
  const cMinutes = document.getElementById('cMinutes');
  const cSeconds = document.getElementById('cSeconds');

  if (cMinutes && cSeconds) {
    const STORAGE_KEY = 'informaticatotal_deadline';
    const WINDOW_MS = 15 * 60 * 1000; // 15 minutos: janela curta para reforçar urgência
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
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining / 1000) % 60);
      cMinutes.textContent = pad(minutes);
      cSeconds.textContent = pad(seconds);
      if (countdownWrap) countdownWrap.classList.toggle('urgent', remaining <= 60000);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Pop-up de prova social (rotina de exemplos ilustrativos) */
  const socialProof = document.getElementById('socialProof');
  if (socialProof) {
    const spAvatar = document.getElementById('spAvatar');
    const spTitle = document.getElementById('spTitle');
    const spSubtitle = document.getElementById('spSubtitle');
    const spClose = document.getElementById('spClose');

    const purchases = [
      ['Mariana', 'Curitiba'], ['Carlos', 'Salvador'], ['Fernanda', 'Recife'],
      ['Bruno', 'Porto Alegre'], ['Juliana', 'Belo Horizonte'], ['Rafael', 'Fortaleza'],
      ['Camila', 'Brasília'], ['Lucas', 'Campinas'], ['Patrícia', 'Goiânia'], ['Rodrigo', 'Manaus'],
    ];
    const timesAgo = ['agora mesmo', 'há 1 minuto', 'há 2 minutos', 'há 3 minutos', 'há 5 minutos'];

    let lastIndex = -1;
    const buildEntry = () => {
      // 1 a cada 3 avisos mostra o total de visualizações; o resto simula garantias recentes
      if (Math.random() < 0.33) {
        const viewers = 14 + Math.floor(Math.random() * 29);
        return {
          initials: '👀',
          title: `${viewers} pessoas estão vendo este curso agora`,
          subtitle: 'Nas últimas horas',
        };
      }
      let i = Math.floor(Math.random() * purchases.length);
      if (i === lastIndex) i = (i + 1) % purchases.length;
      lastIndex = i;
      const [name, city] = purchases[i];
      const when = timesAgo[Math.floor(Math.random() * timesAgo.length)];
      return {
        initials: name.charAt(0),
        title: `${name} de ${city} garantiu a vaga`,
        subtitle: when,
      };
    };

    let cycleTimer = null;
    let hideTimer = null;

    const showNext = () => {
      const entry = buildEntry();
      spAvatar.textContent = entry.initials;
      spTitle.textContent = entry.title;
      spSubtitle.textContent = entry.subtitle;
      socialProof.classList.add('show');
      hideTimer = setTimeout(() => {
        socialProof.classList.remove('show');
        scheduleNext();
      }, 5000);
    };

    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 6000;
      cycleTimer = setTimeout(showNext, delay);
    };

    spClose.addEventListener('click', () => {
      socialProof.classList.remove('show');
      clearTimeout(hideTimer);
      clearTimeout(cycleTimer);
      scheduleNext();
    });

    scheduleNext();
  }

});
