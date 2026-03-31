/* =====================================================
   EAST MERIDIAN — Main JavaScript
   GSAP + ScrollTrigger Animations
   ===================================================== */

/* ── Register GSAP plugins ── */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ════════════════════════════════════════
   PRELOADER
════════════════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Animate circle draw
  gsap.to('.preloader__circle', {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'power2.inOut'
  });

  // After page load, hide preloader
  window.addEventListener('load', () => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.7,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        initHeroAnimations();
        initCounters();
      }
    });
  });

  // Fallback timeout
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      initHeroAnimations();
      initCounters();
    }
  }, 3500);
})();

/* ════════════════════════════════════════
   CANVAS PARTICLE NETWORK (Hero)
════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;
  const COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 168, 67, ${p.alpha})`;
    ctx.fill();
  }

  function drawConnection(a, b, dist) {
    const opacity = (1 - dist / MAX_DIST) * 0.12;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(212, 168, 67, ${opacity})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => p.update());

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          drawConnection(particles[i], particles[j], dist);
        }
      }
      drawParticle(particles[i]);
    }

    animId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createParticles();
    animate();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    animate();
  });

  init();
})();

/* ════════════════════════════════════════
   HERO ANIMATIONS
════════════════════════════════════════ */
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.1 });

  tl.to('.hero__eyebrow', {
    opacity: 1, y: 0,
    duration: 0.7,
    ease: 'power3.out'
  });

  tl.to('#heroWord1', {
    y: 0, opacity: 1,
    duration: 0.9,
    ease: 'expo.out'
  }, '-=0.2');

  tl.to('#heroWord2', {
    y: 0, opacity: 1,
    duration: 0.9,
    ease: 'expo.out'
  }, '-=0.65');

  tl.to('.hero__chinese', {
    opacity: 1, y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4');

  tl.to('.hero__tagline', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3');

  tl.to('.hero__desc', {
    opacity: 1, y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4');

  tl.to('.hero__cta', {
    opacity: 1, y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4');

  // Globe entrance
  tl.fromTo('.hero__globe', {
    opacity: 0,
    scale: 0.7,
    rotation: -15
  }, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 1.4,
    ease: 'elastic.out(1, 0.7)'
  }, '-=1.2');

  // Globe idle rotation
  gsap.to('#heroGlobe', {
    rotation: 3,
    transformOrigin: 'center center',
    duration: 8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Globe globe glow pulse
  gsap.to('.hero__globe-glow', {
    opacity: 0.6,
    scale: 1.15,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Reveal route lines on globe after entrance
  setTimeout(() => {
    gsap.to('#route1', { opacity: 0.6, duration: 0.8 });
    gsap.to('#route2', { opacity: 0.6, duration: 0.8, delay: 0.3 });
    gsap.to('#routeDot1', { opacity: 0.9, duration: 0.5 });
    gsap.to('#routeDot2', { opacity: 0.9, duration: 0.5, delay: 0.3 });
  }, 1800);

  // Stats bar
  tl.from('.hero__stat', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.5');
}

/* ════════════════════════════════════════
   COUNTER ANIMATION (Hero stats)
════════════════════════════════════════ */
function initCounters() {
  const els = document.querySelectorAll('.hero__stat-n[data-count]');
  els.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = target > 999 ? 2.5 : 1.5;
    gsap.to({ val: 0 }, {
      val: target,
      duration,
      delay: 0.8,
      ease: 'power2.out',
      onUpdate: function () {
        const v = Math.floor(this.targets()[0].val);
        el.textContent = v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v;
      }
    });
  });
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');

  // Scroll detection
  ScrollTrigger.create({
    start: 60,
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('nav__drawer-open');
    });
  }

  // Smooth close on link click
  document.querySelectorAll('.nav__link, .nav__drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      nav.classList.remove('nav__drawer-open');
    });
  });

  // Active link highlight
  document.querySelectorAll('section[id]').forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => highlightLink(section.id),
      onEnterBack: () => highlightLink(section.id)
    });
  });

  function highlightLink(id) {
    document.querySelectorAll('.nav__link').forEach(l => {
      l.style.color = l.getAttribute('href') === `#${id}`
        ? 'var(--text)'
        : '';
    });
  }
})();

/* ════════════════════════════════════════
   ABOUT SECTION
════════════════════════════════════════ */
(function initAbout() {
  const about = document.querySelector('.about');
  if (!about) return;

  gsap.from('.about__card--back', {
    scrollTrigger: { trigger: about, start: 'top 70%' },
    x: -60, opacity: 0, rotation: -8,
    duration: 1.1, ease: 'expo.out'
  });

  gsap.from('.about__card--front', {
    scrollTrigger: { trigger: about, start: 'top 65%' },
    x: 60, opacity: 0, y: 30,
    duration: 1.1, ease: 'expo.out', delay: 0.25
  });

  gsap.from('.about .section-eyebrow', {
    scrollTrigger: { trigger: about, start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
  });

  gsap.from('.about .section-title', {
    scrollTrigger: { trigger: about, start: 'top 65%' },
    opacity: 0, y: 30, duration: 0.9, ease: 'expo.out', delay: 0.1
  });

  gsap.from('.about__lead, .about__body', {
    scrollTrigger: { trigger: about, start: 'top 60%' },
    opacity: 0, y: 25, duration: 0.8, ease: 'power3.out',
    stagger: 0.2, delay: 0.2
  });

  gsap.from('.about__feature', {
    scrollTrigger: { trigger: '.about__features', start: 'top 75%' },
    opacity: 0, x: -30, duration: 0.7, ease: 'power3.out',
    stagger: 0.15, delay: 0.1
  });
})();

/* ════════════════════════════════════════
   SERVICES CARDS
════════════════════════════════════════ */
(function initServices() {
  const cards = document.querySelectorAll('.svc-card');
  if (!cards.length) return;

  gsap.from('.services .section-header', {
    scrollTrigger: { trigger: '.services', start: 'top 70%' },
    opacity: 0, y: 40, duration: 0.9, ease: 'expo.out'
  });

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: 'expo.out'
    });

    // Icon hover animation
    const icon = card.querySelector('.svc-card__icon svg');
    if (icon) {
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, { scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    }
  });
})();

/* ════════════════════════════════════════
   LOGISTICS MAP ANIMATION
════════════════════════════════════════ */
(function initLogisticsMap() {
  const map = document.getElementById('logisticsMap');
  if (!map) return;

  const st = ScrollTrigger.create({
    trigger: map,
    start: 'top 70%',
    once: true,
    onEnter: () => {
      // Animate route lines in via strokeDashoffset
      const routes = ['#airRoute', '#railRoute', '#seaRoute'];
      routes.forEach((sel, i) => {
        const path = map.querySelector(sel);
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.7 });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          delay: i * 0.6 + 0.3,
          ease: 'power2.inOut',
          onStart: () => gsap.set(path, { opacity: 0.7 })
        });
      });

      // Animate city nodes
      const nodes = map.querySelectorAll('.map-node');
      gsap.from(nodes, {
        scale: 0,
        transformOrigin: 'center center',
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(2)',
        delay: 0.2
      });

      // Show moving dots after routes are drawn
      setTimeout(() => {
        ['#airDot', '#railDot', '#seaDot'].forEach(sel => {
          const dot = map.querySelector(sel);
          if (dot) gsap.to(dot, { opacity: 0.85, duration: 0.5 });
        });
      }, 2800);
    }
  });

  // Animate route cards
  gsap.from('.route-card', {
    scrollTrigger: { trigger: '.logistics__routes', start: 'top 75%' },
    opacity: 0, y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'expo.out'
  });

  gsap.from('.logistics__local', {
    scrollTrigger: { trigger: '.logistics__local', start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
  });
})();

/* ════════════════════════════════════════
   STATS COUNTERS (stat-item)
════════════════════════════════════════ */
(function initStatCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  statItems.forEach(item => {
    const counter = item.querySelector('.counter');
    if (!counter) return;
    const target = parseInt(item.getAttribute('data-count'));
    const suffix = item.getAttribute('data-suffix') || '';
    let triggered = false;

    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        const dur = target > 5000 ? 2.5 : target > 500 ? 2 : 1.5;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: dur,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.round(obj.val);
            counter.textContent = v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v;
          },
          onComplete() {
            counter.textContent = target >= 1000 ? (target / 1000).toFixed(0) + 'K' : target;
          }
        });
      }
    });
  });

  // Animate stat items entrance
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.stats-grid', start: 'top 75%' },
    opacity: 0, y: 40,
    stagger: 0.12,
    duration: 0.8,
    ease: 'expo.out'
  });
})();

/* ════════════════════════════════════════
   PROCESS STEPS
════════════════════════════════════════ */
(function initProcess() {
  const steps = document.querySelectorAll('.process__step');
  if (!steps.length) return;

  const line = document.getElementById('processLine');

  // Animate the vertical line growing
  if (line) {
    gsap.to(line, {
      scrollTrigger: {
        trigger: '.process__steps',
        start: 'top 65%',
        end: 'bottom 70%',
        scrub: 0.8
      },
      height: '100%',
      ease: 'none'
    });
  }

  // Animate each step
  steps.forEach((step, i) => {
    gsap.to(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 78%',
        toggleClass: { targets: step, className: 'active' }
      },
      opacity: 1,
      x: 0,
      duration: 0.7,
      delay: 0.1,
      ease: 'power3.out'
    });

    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 78%' },
      opacity: 0, x: -40, duration: 0.8, ease: 'expo.out', delay: i * 0.08
    });
  });
})();

/* ════════════════════════════════════════
   PLATFORMS SECTION
════════════════════════════════════════ */
(function initPlatforms() {
  gsap.from('.platforms .section-eyebrow, .platforms .section-title, .platforms p, .platforms__list, .platforms .btn', {
    scrollTrigger: { trigger: '.platforms__inner', start: 'top 70%' },
    opacity: 0, x: -40,
    stagger: 0.1,
    duration: 0.8,
    ease: 'expo.out'
  });

  const badges = document.querySelectorAll('.platform-badge');
  badges.forEach((badge, i) => {
    gsap.to(badge, {
      scrollTrigger: { trigger: '.platforms__icons', start: 'top 75%' },
      opacity: 1, scale: 1,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'back.out(1.5)'
    });

    // Float animation
    gsap.to(badge, {
      y: -6,
      duration: 1.8 + i * 0.3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.2
    });
  });
})();

/* ════════════════════════════════════════
   WHY US
════════════════════════════════════════ */
(function initWhyUs() {
  gsap.from('.why-us .section-header', {
    scrollTrigger: { trigger: '.why-us', start: 'top 70%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'expo.out'
  });

  const cards = document.querySelectorAll('.why-card');
  cards.forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 82%' },
      opacity: 1, y: 0,
      duration: 0.75,
      delay: (i % 3) * 0.1,
      ease: 'expo.out'
    });
  });
})();

/* ════════════════════════════════════════
   CONTACT SECTION
════════════════════════════════════════ */
(function initContact() {
  gsap.from('.contact__info > *', {
    scrollTrigger: { trigger: '.contact__inner', start: 'top 70%' },
    opacity: 0, x: -30,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact__inner', start: 'top 70%' },
    opacity: 0, x: 40, y: 30,
    duration: 1,
    ease: 'expo.out',
    delay: 0.2
  });

  gsap.from('.contact__channel', {
    scrollTrigger: { trigger: '.contact__channels', start: 'top 80%' },
    opacity: 0, x: -20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out'
  });

  // Form submit
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Отправлено!</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.style.background = '#2d8a4e';
      gsap.from(btn, { scale: 0.95, duration: 0.3, ease: 'back.out(2)' });

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  }
})();

/* ════════════════════════════════════════
   SECTION HEADERS (global)
════════════════════════════════════════ */
(function initSectionHeaders() {
  document.querySelectorAll('.section-header:not(.about .section-header):not(.why-us .section-header)').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: 'top 80%' },
      opacity: 0, y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: 'expo.out'
    });
  });
})();

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
(function initFooter() {
  gsap.from('.footer__top > *', {
    scrollTrigger: { trigger: '.footer', start: 'top 85%' },
    opacity: 0, y: 20,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out'
  });
})();

/* ════════════════════════════════════════
   PARALLAX: hero orbs follow mouse
════════════════════════════════════════ */
(function initMouseParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      gsap.to(orb, {
        x: dx * factor,
        y: dy * factor,
        duration: 1.2,
        ease: 'power2.out'
      });
    });
  });
})();

/* ════════════════════════════════════════
   SMOOTH SCROLL for nav links
════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = document.getElementById('mainNav')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 20;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ════════════════════════════════════════
   ABOUT CARD HOVER TILT
════════════════════════════════════════ */
(function initCardTilt() {
  const card = document.querySelector('.about__card--front');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: x * 12,
      rotationX: -y * 12,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationY: 0, rotationX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });
  });
})();

/* ════════════════════════════════════════
   REFRESH ScrollTrigger after fonts load
════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => ScrollTrigger.refresh(), 300);
});
