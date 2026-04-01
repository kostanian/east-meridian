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
        initHeroMap();
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
      initHeroMap();
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

  // Map container entrance
  tl.fromTo('.hero__map-container', {
    opacity: 0, scale: 0.9, y: 20
  }, {
    opacity: 1, scale: 1, y: 0,
    duration: 1.2, ease: 'expo.out'
  }, '-=1.2');

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

  gsap.from('.about__img-wrap', {
    scrollTrigger: { trigger: about, start: 'top 70%' },
    x: -40, opacity: 0, scale: 0.96,
    duration: 1.1, ease: 'expo.out'
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
   LOGISTICS ROUTE CARDS ANIMATION
════════════════════════════════════════ */
(function initLogisticsCards() {
  gsap.from('.route-card', {
    scrollTrigger: { trigger: '.logistics__routes', start: 'top 75%' },
    opacity: 0, y: 50,
    stagger: 0.15, duration: 0.8, ease: 'expo.out'
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

  // Animate each step (single fromTo to avoid conflicts)
  steps.forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: -40 },
      {
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          toggleClass: { targets: step, className: 'active' }
        },
        opacity: 1, x: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'expo.out'
      }
    );
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
   D3 MAP HELPER
════════════════════════════════════════ */
async function buildD3Map(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container || typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

  const W = container.offsetWidth || 420;
  const H = container.offsetHeight || options.height || 420;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', H)
    .attr('viewBox', `0 0 ${W} ${H}`);

  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', `glow-${containerId}`)
    .attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%');
  glow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '4').attr('result', 'blur');
  const fmg = glow.append('feMerge');
  fmg.append('feMergeNode').attr('in', 'blur');
  fmg.append('feMergeNode').attr('in', 'SourceGraphic');

  const proj = d3.geoMercator()
    .center(options.center)
    .scale(options.scale || 160)
    .translate([W * (options.tx || 0.5), H * (options.ty || 0.5)]);

  const path = d3.geoPath().projection(proj);

  // Graticule
  const grat = d3.geoGraticule().step([15, 15]);
  svg.append('path').datum(grat()).attr('d', path)
    .attr('fill', 'none').attr('stroke', 'rgba(212,168,67,0.05)').attr('stroke-width', 0.6);

  try {
    const world = await d3.json('countries-110m.json');
    const loader = container.querySelector('.hero__map-loader, .logistics__map-loader');
    if (loader) gsap.to(loader, { opacity: 0, duration: 0.4, onComplete: () => loader.remove() });

    const all = topojson.feature(world, world.objects.countries);
    const styled = {
      '156': { fill: 'rgba(212,168,67,0.14)', stroke: 'rgba(212,168,67,0.75)', sw: 1.2 },
      '643': { fill: 'rgba(200,191,160,0.06)', stroke: 'rgba(200,191,160,0.45)', sw: 0.8 },
      '398': { fill: 'rgba(200,191,160,0.09)', stroke: 'rgba(200,191,160,0.5)', sw: 0.8 },
      '496': { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.12)', sw: 0.4 },
    };
    const feat = Object.keys(styled);

    svg.append('g').selectAll('path')
      .data(all.features.filter(d => !feat.includes(String(d.id))))
      .join('path').attr('d', path)
      .attr('fill', 'rgba(255,255,255,0.012)').attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 0.25);

    svg.append('g').selectAll('path')
      .data(all.features.filter(d => feat.includes(String(d.id))))
      .join('path').attr('d', path)
      .attr('fill', d => styled[String(d.id)]?.fill || 'transparent')
      .attr('stroke', d => styled[String(d.id)]?.stroke || 'none')
      .attr('stroke-width', d => styled[String(d.id)]?.sw || 0)
      .attr('opacity', 0)
      .each(function(_, i) { gsap.to(this, { opacity: 1, duration: 0.7, delay: i * 0.1 + 0.2 }); });

    // Routes
    if (options.routes) {
      options.routes.forEach((r, i) => {
        const el = svg.append('path')
          .datum({ type: 'Feature', geometry: { type: 'LineString', coordinates: r.coords } })
          .attr('d', path).attr('fill', 'none')
          .attr('stroke', r.color).attr('stroke-width', 1.8).attr('stroke-linecap', 'round')
          .node();
        if (el) {
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: `10 6`, strokeDashoffset: len, opacity: 0 });
          gsap.to(el, { strokeDashoffset: 0, opacity: 0.8, duration: 2, delay: i * 0.8 + 1, ease: 'power2.inOut' });
        }
      });
    }

    // Cities
    if (options.cities) {
      const cg = svg.append('g');
      options.cities.forEach((city, i) => {
        const pos = proj([city.lon, city.lat]);
        if (!pos || isNaN(pos[0])) return;
        const [cx, cy] = pos;
        const r = city.main ? 6 : 4;
        const g = cg.append('g').attr('opacity', 0);

        if (city.main) {
          const ring = g.append('circle').attr('cx', cx).attr('cy', cy)
            .attr('r', r + 8).attr('fill', 'none')
            .attr('stroke', city.color).attr('stroke-width', 0.9).attr('opacity', 0.2).node();
          if (ring) gsap.to(ring, { attr: { r: r + 20 }, opacity: 0, duration: 2.5, repeat: -1, ease: 'power2.out', delay: i * 0.3 });
        }

        g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r)
          .attr('fill', city.color).attr('opacity', city.main ? 0.95 : 0.65)
          .attr('filter', city.main ? `url(#glow-${containerId})` : null);

        const tx = cx + city.dx;
        const ta = city.dx > 0 ? 'start' : 'end';
        g.append('text').attr('x', tx).attr('y', cy + 3)
          .attr('text-anchor', ta).attr('fill', city.color)
          .attr('font-size', city.main ? '10.5' : '8.5')
          .attr('font-family', 'Inter, sans-serif').attr('font-weight', city.main ? '600' : '400')
          .text(city.name);
        if (city.sub) {
          g.append('text').attr('x', tx).attr('y', cy + 15)
            .attr('text-anchor', ta).attr('fill', city.color)
            .attr('font-size', '8').attr('font-family', 'serif').attr('opacity', 0.5).text(city.sub);
        }
        gsap.to(g.node(), { opacity: 1, duration: 0.5, delay: i * 0.08 + 0.6 });
      });
    }

    // Country labels
    if (options.labels) {
      options.labels.forEach(l => {
        const pos = proj([l.lon, l.lat]);
        if (!pos) return;
        svg.append('text').attr('x', pos[0]).attr('y', pos[1])
          .attr('text-anchor', 'middle').attr('fill', l.color)
          .attr('font-size', '9').attr('font-family', 'Inter, sans-serif')
          .attr('font-weight', '700').attr('letter-spacing', '0.15em')
          .attr('opacity', 0).text(l.text)
          .transition().duration(900).delay(900).attr('opacity', 1);
      });
    }

  } catch(err) {
    console.warn(`Map ${containerId} failed:`, err);
    const loader = container.querySelector('.hero__map-loader, .logistics__map-loader');
    if (loader) loader.innerHTML = '<span style="opacity:.35;font-size:11px;color:#9fa8b4">Карта недоступна</span>';
  }
}

/* ════════════════════════════════════════
   HERO MAP (D3)
════════════════════════════════════════ */
async function initHeroMap() {
  const container = document.getElementById('heroMap');
  if (!container || typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

  const W = container.offsetWidth || 420;
  const H = 460;
  const center = [95, 50];
  const scale = 165;

  const svg = d3.select(container)
    .append('svg').attr('width','100%').attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);

  const defs = svg.append('defs');
  // Glow filter
  const gf = defs.append('filter').attr('id','heroGlow').attr('x','-80%').attr('y','-80%').attr('width','260%').attr('height','260%');
  gf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','5').attr('result','blur');
  const fm = gf.append('feMerge');
  fm.append('feMergeNode').attr('in','blur');
  fm.append('feMergeNode').attr('in','SourceGraphic');

  // Graticule
  const proj = d3.geoMercator().center(center).scale(scale).translate([W*0.52, H*0.52]);
  const path = d3.geoPath().projection(proj);
  svg.append('path').datum(d3.geoGraticule().step([20,20])())
    .attr('d', path).attr('fill','none').attr('stroke','rgba(212,168,67,0.04)').attr('stroke-width',0.6);

  const loader = container.querySelector('.hero__map-loader');

  try {
    const world = await d3.json('countries-110m.json');
    if (loader) gsap.to(loader, { opacity:0, duration:0.4, onComplete:()=>loader.remove() });

    const all = topojson.feature(world, world.objects.countries);
    const hi = { '156':'rgba(212,168,67,0.14)', '643':'rgba(200,191,160,0.06)', '398':'rgba(200,191,160,0.09)' };
    const hiS = { '156':'rgba(212,168,67,0.7)', '643':'rgba(200,191,160,0.4)', '398':'rgba(200,191,160,0.45)' };

    svg.append('g').selectAll('path')
      .data(all.features.filter(d=>!hi[String(d.id)]))
      .join('path').attr('d',path)
      .attr('fill','rgba(255,255,255,0.012)').attr('stroke','rgba(255,255,255,0.04)').attr('stroke-width',0.25);

    svg.append('g').selectAll('path')
      .data(all.features.filter(d=>hi[String(d.id)]))
      .join('path').attr('d',path)
      .attr('fill',d=>hi[String(d.id)]||'transparent')
      .attr('stroke',d=>hiS[String(d.id)]||'none')
      .attr('stroke-width',d=>d.id===156?1.1:0.7)
      .attr('opacity',0).each(function(_,i){ gsap.to(this,{opacity:1,duration:0.7,delay:i*0.1+0.2}); });

    // === Hub: центр Китая ===
    const HUB = [105, 33]; // условный центр Китая
    const hubPx = proj(HUB);

    // === Китайские города → Hub ===
    const cnCities = [
      { name:'Пекин',    sub:'北京', lon:116.4, lat:39.9 },
      { name:'Гуанчжоу', sub:'广州', lon:113.3, lat:23.1 },
      { name:'Иу',       sub:'义乌', lon:120.1, lat:29.3 },
      { name:'Чунцин',   sub:'重庆', lon:106.6, lat:29.6 },
    ];
    const cnRoutes = svg.append('g').attr('class','cn-routes');
    cnCities.forEach((c, i) => {
      const p0 = proj([c.lon, c.lat]);
      const el = cnRoutes.append('line')
        .attr('x1',p0[0]).attr('y1',p0[1])
        .attr('x2',hubPx[0]).attr('y2',hubPx[1])
        .attr('stroke','rgba(212,168,67,0.55)').attr('stroke-width',1.2)
        .attr('stroke-dasharray','5 4').attr('opacity',0).node();
      gsap.to(el, { opacity:1, duration:0.5, delay: i*0.15 + 1.2 });
    });

    // === Hub → Россия hub (Москва) → города России ===
    const RU_HUB = [55, 56]; // центр европейской части РФ
    const ruHubPx = proj(RU_HUB);
    const ruCities = [
      { name:'Москва',        lon:37.6,  lat:55.8 },
      { name:'С.-Петербург',  lon:30.3,  lat:59.9 },
      { name:'Екатеринбург',  lon:60.6,  lat:56.8 },
      { name:'Новосибирск',   lon:82.9,  lat:55.0 },
    ];
    // Владивосток — прямая линия из Пекина
    const BEIJING = [116.4, 39.9];
    const VLADIVOSTOK = { name:'Владивосток', lon:131.9, lat:43.1 };

    // Hub China → Hub Russia
    const ruMainEl = svg.append('path')
      .datum({type:'Feature',geometry:{type:'LineString',coordinates:[HUB,RU_HUB]}})
      .attr('d',path).attr('fill','none')
      .attr('stroke','#c8bfa0').attr('stroke-width',1.8).attr('stroke-linecap','round').node();
    if (ruMainEl) {
      const len = ruMainEl.getTotalLength();
      gsap.set(ruMainEl,{strokeDasharray:`8 5`,strokeDashoffset:len,opacity:0});
      gsap.to(ruMainEl,{strokeDashoffset:0,opacity:0.75,duration:1.8,delay:1.8,ease:'power2.inOut'});
    }

    // Hub Russia → города
    ruCities.forEach((c,i) => {
      const p1 = proj([c.lon,c.lat]);
      if (!p1) return;
      const el = svg.append('line')
        .attr('x1',ruHubPx[0]).attr('y1',ruHubPx[1])
        .attr('x2',p1[0]).attr('y2',p1[1])
        .attr('stroke','rgba(200,191,160,0.45)').attr('stroke-width',0.9)
        .attr('stroke-dasharray','4 4').attr('opacity',0).node();
      gsap.to(el,{opacity:1,duration:0.5,delay: 3.6 + i*0.12});
    });

    // Пекин → Владивосток (прямая)
    const vlPx = proj([VLADIVOSTOK.lon, VLADIVOSTOK.lat]);
    const bjPx = proj(BEIJING);
    if (vlPx && bjPx) {
      const vlEl = svg.append('line')
        .attr('x1',bjPx[0]).attr('y1',bjPx[1])
        .attr('x2',vlPx[0]).attr('y2',vlPx[1])
        .attr('stroke','rgba(200,191,160,0.55)').attr('stroke-width',1.1)
        .attr('stroke-dasharray','6 4').attr('opacity',0).node();
      gsap.to(vlEl,{opacity:1,duration:0.5,delay:3.8});

      // Точка и подпись Владивостока
      const vlG = svg.append('g').attr('opacity',0);
      vlG.append('circle').attr('cx',vlPx[0]).attr('cy',vlPx[1]).attr('r',2.8)
        .attr('fill','rgba(200,191,160,0.65)');
      vlG.append('text').attr('x',vlPx[0]+7).attr('y',vlPx[1]+3.5)
        .attr('fill','rgba(200,191,160,0.65)').attr('font-size','8')
        .attr('font-family','Inter,sans-serif').text('Владивосток');
      gsap.to(vlG.node(),{opacity:1,duration:0.4,delay:4.0});
    }

    // === Hub → Казахстан hub → города Казахстана ===
    const KZ_HUB = [68, 48];
    const kzHubPx = proj(KZ_HUB);
    const kzCities = [
      { name:'Алматы',  lon:76.9, lat:43.2 },
      { name:'Астана',  lon:71.4, lat:51.2 },
      { name:'Шымкент', lon:69.6, lat:42.3 },
    ];

    const kzMainEl = svg.append('path')
      .datum({type:'Feature',geometry:{type:'LineString',coordinates:[HUB,KZ_HUB]}})
      .attr('d',path).attr('fill','none')
      .attr('stroke','#b8b0a0').attr('stroke-width',1.8).attr('stroke-linecap','round').node();
    if (kzMainEl) {
      const len = kzMainEl.getTotalLength();
      gsap.set(kzMainEl,{strokeDasharray:`8 5`,strokeDashoffset:len,opacity:0});
      gsap.to(kzMainEl,{strokeDashoffset:0,opacity:0.7,duration:1.4,delay:2.2,ease:'power2.inOut'});
    }

    kzCities.forEach((c,i) => {
      const p1 = proj([c.lon,c.lat]);
      if (!p1) return;
      const el = svg.append('line')
        .attr('x1',kzHubPx[0]).attr('y1',kzHubPx[1])
        .attr('x2',p1[0]).attr('y2',p1[1])
        .attr('stroke','rgba(184,176,160,0.45)').attr('stroke-width',0.9)
        .attr('stroke-dasharray','4 4').attr('opacity',0).node();
      gsap.to(el,{opacity:1,duration:0.5,delay: 3.8 + i*0.12});
    });

    // === Пульсирующий Hub ===
    const hubG = svg.append('g');
    [22,14,7].forEach((r,i)=>{
      hubG.append('circle').attr('cx',hubPx[0]).attr('cy',hubPx[1]).attr('r',r)
        .attr('fill','none').attr('stroke','rgba(212,168,67,0.2)').attr('stroke-width',0.8)
        .attr('opacity',0).each(function(){ gsap.to(this,{opacity:1,duration:0.4,delay:1+i*0.1}); });
    });
    hubG.append('circle').attr('cx',hubPx[0]).attr('cy',hubPx[1]).attr('r',5)
      .attr('fill','#d4a843').attr('opacity',0).attr('filter','url(#heroGlow)')
      .each(function(){ gsap.to(this,{opacity:0.95,duration:0.5,delay:0.9}); });

    // Pulse animation on hub
    gsap.to(hubG.select('circle:last-child').node(),{
      attr:{r:7},opacity:0.6,duration:1.5,yoyo:true,repeat:-1,ease:'sine.inOut',delay:2
    });

    // === Города Китая — точки ===
    cnCities.forEach((c,i)=>{
      const p = proj([c.lon,c.lat]);
      if (!p) return;
      const g = svg.append('g').attr('opacity',0);
      g.append('circle').attr('cx',p[0]).attr('cy',p[1]).attr('r',4.5)
        .attr('fill','#d4a843').attr('opacity',0.85).attr('filter','url(#heroGlow)');
      const ta = c.lon < HUB[0] ? 'end' : 'start';
      const dx = c.lon < HUB[0] ? -8 : 8;
      g.append('text').attr('x',p[0]+dx).attr('y',p[1]+1).attr('text-anchor',ta)
        .attr('fill','#d4a843').attr('font-size','9.5').attr('font-family','Inter,sans-serif').attr('font-weight','600').text(c.name);
      g.append('text').attr('x',p[0]+dx).attr('y',p[1]+12).attr('text-anchor',ta)
        .attr('fill','#d4a843').attr('font-size','8').attr('font-family','serif').attr('opacity',0.5).text(c.sub);
      gsap.to(g.node(),{opacity:1,duration:0.4,delay:0.5+i*0.1});
    });

    // === Hub Russia точка ===
    svg.append('circle').attr('cx',ruHubPx[0]).attr('cy',ruHubPx[1]).attr('r',6)
      .attr('fill','#c8bfa0').attr('opacity',0).attr('filter','url(#heroGlow)')
      .each(function(){ gsap.to(this,{opacity:0.9,duration:0.5,delay:3.4}); });
    svg.append('text').attr('x',ruHubPx[0]+9).attr('y',ruHubPx[1]+4)
      .attr('fill','#c8bfa0').attr('font-size','10').attr('font-family','Inter,sans-serif').attr('font-weight','600')
      .attr('opacity',0).text('Россия').each(function(){ gsap.to(this,{opacity:0.9,duration:0.5,delay:3.4}); });

    // === Hub Казахстан точка ===
    svg.append('circle').attr('cx',kzHubPx[0]).attr('cy',kzHubPx[1]).attr('r',5.5)
      .attr('fill','#b8b0a0').attr('opacity',0).attr('filter','url(#heroGlow)')
      .each(function(){ gsap.to(this,{opacity:0.9,duration:0.5,delay:3.6}); });
    svg.append('text').attr('x',kzHubPx[0]+8).attr('y',kzHubPx[1]+4)
      .attr('fill','#b8b0a0').attr('font-size','10').attr('font-family','Inter,sans-serif').attr('font-weight','600')
      .attr('opacity',0).text('Казахстан').each(function(){ gsap.to(this,{opacity:0.9,duration:0.5,delay:3.6}); });

    // === Маленькие точки городов России и Казахстана ===
    [...ruCities, ...kzCities].forEach((c,i)=>{
      const p = proj([c.lon,c.lat]);
      if (!p) return;
      const isRu = i < ruCities.length;
      const col = isRu ? 'rgba(200,191,160,0.65)' : 'rgba(184,176,160,0.65)';
      const g = svg.append('g').attr('opacity',0);
      g.append('circle').attr('cx',p[0]).attr('cy',p[1]).attr('r',2.8).attr('fill',col);
      g.append('text').attr('x',p[0]+(c.lon>55?7:-7)).attr('y',p[1]+3.5)
        .attr('text-anchor',c.lon>55?'start':'end')
        .attr('fill',col).attr('font-size','8').attr('font-family','Inter,sans-serif').text(c.name);
      gsap.to(g.node(),{opacity:1,duration:0.4,delay: 4 + i*0.1});
    });

    // === Подписи стран ===
    const labels = [
      { text:'КИТАЙ', lon:103, lat:42, color:'rgba(212,168,67,0.28)' },
      { text:'РОССИЯ', lon:70, lat:65, color:'rgba(200,191,160,0.22)' },
      { text:'КАЗАХСТАН', lon:55, lat:42, color:'rgba(184,176,160,0.22)' },
    ];
    labels.forEach(l=>{
      const p = proj([l.lon,l.lat]);
      if (!p) return;
      svg.append('text').attr('x',p[0]).attr('y',p[1])
        .attr('text-anchor','middle').attr('fill',l.color)
        .attr('font-size','8').attr('font-family','Inter,sans-serif')
        .attr('font-weight','700').attr('letter-spacing','0.2em').attr('opacity',0).text(l.text)
        .transition().duration(900).delay(700).attr('opacity',1);
    });

  } catch(err) {
    console.warn('Hero map failed:', err);
    if (loader) loader.innerHTML = '<span style="opacity:.35;font-size:11px;color:#9fa8b4">Карта недоступна</span>';
  }
}


/* ════════════════════════════════════════
   REFRESH ScrollTrigger after fonts load
════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => ScrollTrigger.refresh(), 300);
});
