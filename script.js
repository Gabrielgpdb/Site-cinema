/* =============================================
   CINEESTREIA — script.js
   ============================================= */

/* ── Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 800);
});

/* ── Header scroll effect ── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Mobile menu toggle ── */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on nav link click
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ── Animated counter ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const step = duration / target;
  let current = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) {
      clearInterval(timer);
      el.textContent = target;
    }
  }, step);
}

// Observe counter section
const counterBar = document.querySelector('.counter-bar');
if (counterBar) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.counter-num').forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(counterBar);
}

/* ── Scroll reveal ── */
document.querySelectorAll('.movie-card, .contact-info, .contact-form-wrapper').forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Modal system ── */
const overlay   = document.getElementById('modalOverlay');
const allModals = document.querySelectorAll('.modal');

function openModal(id) {
  if (!overlay) return;
  // Close any open first
  allModals.forEach(m => m.classList.remove('active'));
  const target = document.getElementById('modal-' + id);
  if (!target) return;
  overlay.classList.add('active');
  target.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  if (!overlay) return;
  overlay.classList.remove('active');
  allModals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// Card clicks
document.querySelectorAll('.movie-card').forEach(card => {
  card.addEventListener('click', () => {
    openModal(card.dataset.modal);
  });
  // Keyboard accessibility
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.modal);
    }
  });
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Click outside modal
if (overlay) {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeAllModals();
  });
}

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
});

/* ── Contact Form Validation & Success ── */
const form       = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const btnNova    = document.getElementById('btnNova');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Nome
    const nome = document.getElementById('nome');
    const nomeGroup = nome?.closest('.form-group');
    if (!nome?.value.trim() || nome.value.trim().length < 2) {
      nomeGroup?.classList.add('error');
      valid = false;
    } else {
      nomeGroup?.classList.remove('error');
    }

    // Email
    const email = document.getElementById('email');
    const emailGroup = email?.closest('.form-group');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailRegex.test(email.value.trim())) {
      emailGroup?.classList.add('error');
      valid = false;
    } else {
      emailGroup?.classList.remove('error');
    }

    // Mensagem
    const msg = document.getElementById('mensagem');
    const msgGroup = msg?.closest('.form-group');
    if (!msg?.value.trim() || msg.value.trim().length < 10) {
      msgGroup?.classList.add('error');
      valid = false;
    } else {
      msgGroup?.classList.remove('error');
    }

    if (valid) {
      // Show success with animation
      form.style.display = 'none';
      formSuccess?.classList.add('show');
    } else {
      // Shake the button
      const btn = document.getElementById('btnEnviar');
      if (btn) {
        btn.style.animation = 'shake 0.4s ease';
        btn.addEventListener('animationend', () => {
          btn.style.animation = '';
        }, { once: true });
      }
    }
  });

  // Live validation on blur
  ['nome', 'email', 'mensagem'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      const group = el.closest('.form-group');
      if (el.value.trim()) group?.classList.remove('error');
    });
    el.addEventListener('input', () => {
      const group = el.closest('.form-group');
      if (group?.classList.contains('error') && el.value.trim()) {
        group.classList.remove('error');
      }
    });
  });
}

// Reset form
if (btnNova) {
  btnNova.addEventListener('click', () => {
    if (form) {
      form.reset();
      form.style.display = 'flex';
    }
    formSuccess?.classList.remove('show');
  });
}

// Inject shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}`;
document.head.appendChild(shakeStyle);

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Card magnetic cursor tilt effect ── */
document.querySelectorAll('.movie-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const dx     = (x - cx) / cx;
    const dy     = (y - cy) / cy;
    const rotX   = -dy * 6;
    const rotY   =  dx * 6;
    card.style.transform = `translateY(-10px) scale(1.02) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease, border-color 0.3s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.3s ease';
  });
});

/* ── Fix imagem De Volta para o Futuro ── */
const bttfPaths = [
  'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
  'https://image.tmdb.org/t/p/w500/pTpxQB1N0waaSc3OSn0e9oc8kx9.jpg',
  'https://image.tmdb.org/t/p/original/pTpxQB1N0waaSc3OSn0e9oc8kx9.jpg',
];

function tryNextBttfPath(img, index) {
  if (index >= bttfPaths.length) return;
  img.onerror = () => tryNextBttfPath(img, index + 1);
  img.src = bttfPaths[index];
}

document.querySelectorAll('img[alt="De Volta para o Futuro"]').forEach(img => {
  img.onerror = () => tryNextBttfPath(img, 1);
  img.src = bttfPaths[0];
});
