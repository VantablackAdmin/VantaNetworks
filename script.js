/* ═══════════════════════════════════════════════
   TROY JENNINGS — Portfolio JS
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CUSTOM CURSOR ───────────────────────────────────────
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor scale on interactive elements
  document.querySelectorAll('a, button, .overhaul-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(2.5)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.4)';
      cursorTrail.style.opacity   = '0.15';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.opacity   = '0.4';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity      = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity      = '1';
    cursorTrail.style.opacity = '0.4';
  });


  // ─── NAV SCROLL EFFECT ───────────────────────────────────
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─── HAMBURGER MENU ──────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ─── HERO REVEAL ANIMATIONS ──────────────────────────────
  // Trigger on load (hero elements already have reveal-up class)
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  });


  // ─── SCROLL REVEAL ───────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if container
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Apply fade-in to key elements
  const revealSelectors = [
    '.about-left', '.about-right',
    '.overhaul-card',
    '.skill-group',
    '.timeline-item',
    '.contact-link',
    '.section-label', '.section-heading'
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      el.dataset.delay = i * 80;
      revealObserver.observe(el);
    });
  });


  // ─── COUNTER ANIMATION ───────────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    const start     = performance.now();
    const startVal  = 0;
    const isFloat   = target % 1 !== 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased    = 1 - Math.pow(2, -10 * progress);
      const current  = Math.round(startVal + (target - startVal) * eased);

      el.textContent = current;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num[data-target]');
        nums.forEach(num => {
          const target = parseInt(num.dataset.target, 10);
          animateCounter(num, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);


  // ─── SMOOTH ACTIVE NAV LINK ───────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  // ─── CARD TILT EFFECT ────────────────────────────────────
  document.querySelectorAll('.overhaul-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = y * 4;
      const tiltY  = -x * 4;

      card.style.transform    = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
      card.style.transition   = 'transform 0.1s ease';

      // Move glow to mouse position
      const glow = card.querySelector('.card-glow');
      if (glow) {
        const pctX = (e.clientX - rect.left) / rect.width  * 100;
        const pctY = (e.clientY - rect.top)  / rect.height * 100;
        glow.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(0,229,200,0.06) 0%, transparent 55%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s';
    });
  });


  // ─── SKILL ITEM STAGGER ──────────────────────────────────
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 50}ms`;
          item.style.opacity = '0';
          item.style.transform = 'translateX(-8px)';
          setTimeout(() => {
            item.style.transition = `opacity 0.4s ease, transform 0.4s ease, color 0.2s`;
            item.style.opacity   = '1';
            item.style.transform = 'translateX(0)';
          }, i * 60 + 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-group').forEach(group => skillObserver.observe(group));


  // ─── TYPING EFFECT FOR HERO TAG ──────────────────────────
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const original = heroTag.textContent;
    heroTag.textContent = '';
    let i = 0;

    function typeChar() {
      if (i < original.length) {
        heroTag.textContent += original[i];
        i++;
        setTimeout(typeChar, 28 + Math.random() * 20);
      }
    }

    // Start after short delay
    setTimeout(typeChar, 600);
  }


  // ─── GLITCH EFFECT ON NAME ───────────────────────────────
  const nameTroy = document.querySelector('.name-troy');
  if (nameTroy) {
    const glitchChars = '!@#$%&*<>[]{}';

    function glitch(el, original) {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, idx) => {
          if (idx < iterations) return original[idx];
          if (char === ' ') return ' ';
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('');

        if (iterations >= original.length) clearInterval(interval);
        iterations += 1.5;
      }, 40);
    }

    nameTroy.addEventListener('mouseenter', () => {
      glitch(nameTroy, 'TROY');
    });
  }


  // ─── FOOTER YEAR (future-proofing) ────────────────────────
  // No year shown by design — intentional omission for timelessness


  // ─── LOG ────────────────────────────────────────────────
  console.log('%c Troy Jennings — Network & Systems Administrator ', 'background: #00e5c8; color: #0a0b0e; font-family: monospace; font-size: 13px; padding: 4px 8px; font-weight: bold;');
  console.log('%c CCNA ID: CSCO14119766 ', 'color: #8b92a8; font-family: monospace; font-size: 11px;');

})();
