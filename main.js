/* ══════════════════════════════════════════════
   main.js — Robert Vincent Payne Resume
   Animations & interactive behaviours
══════════════════════════════════════════════ */

/* ── 1. PAGE LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  loader.classList.add('hidden');

  // Trigger header entrance animations after loader hides
  setTimeout(() => {
    document.querySelector('.avatar').classList.add('revealed');
    typewriterEffect();
  }, 300);

  setTimeout(() => {
    document.querySelector('.tagline').classList.add('revealed');
    document.querySelector('.contact-row').classList.add('revealed');
  }, 600);
});


/* ── 2. TYPEWRITER — hero name ── */
function typewriterEffect() {
  const el = document.getElementById('hero-name');
  const text = el.getAttribute('data-text'); // full text stored in data attribute
  el.textContent = '';

  let i = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'animation: blink .7s step-end infinite; color: var(--gold-lt);';
  el.appendChild(cursor);

  // inject blink keyframes once
  if (!document.getElementById('blink-style')) {
    const s = document.createElement('style');
    s.id = 'blink-style';
    s.textContent = '@keyframes blink { 50% { opacity: 0; } }';
    document.head.appendChild(s);
  }

  const interval = setInterval(() => {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => cursor.remove(), 800);
    }
  }, 60);
}


/* ── 3. SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });


/* ── 4. BACK-TO-TOP BUTTON ── */
const backBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 5. ACTIVE NAV LINK (Intersection Observer) ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));


/* ── 6. REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 7. SKILL BARS — animate width when scrolled into view ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(fill => {
        const target = fill.getAttribute('data-width');
        fill.style.width = target;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillBlock = document.querySelector('.aside-block');
if (skillBlock) barObserver.observe(skillBlock);


/* ── 8. CLASSMATES TABLE — row count-up on first view ── */
const tableBody = document.querySelector('#classmates tbody');

if (tableBody) {
  const tableObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, i) => {
          row.style.opacity = '0';
          row.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            row.style.transition = 'opacity .4s ease, transform .4s ease';
            row.style.opacity   = '1';
            row.style.transform = 'translateX(0)';
          }, i * 80);
        });
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  tableObserver.observe(tableBody);
}


/* ── 9. INTEREST TAGS — ripple on click ── */
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,.5);
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      transform: scale(0);
      animation: ripple .5s ease forwards;
      pointer-events: none;
    `;

    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = `
        @keyframes ripple {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});


/* ── 10. NAV SMOOTH SCROLL (override default jump on older browsers) ── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 11. FOOTER — animated year counter ── */
const yearEl = document.getElementById('footer-year');
if (yearEl) {
  const endYear = new Date().getFullYear();
  const startYear = endYear - 3;
  let current = startYear;
  const counter = setInterval(() => {
    yearEl.textContent = current;
    current++;
    if (current > endYear) clearInterval(counter);
  }, 120);
}
