/* =====================================================================
   CAPSTONE TECHNOLOGIES — interactions (multi-page)
   Vanilla JS · no dependencies · respects prefers-reduced-motion
   ===================================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Nav: stick, hide-on-scroll, over-hero swap ---------- */
  const nav = $('#nav');
  const overHero = nav && nav.classList.contains('nav--over-hero');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 24);
    if (y > lastY && y > 400) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastY = y;
  };
  if (nav) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const navMobile = $('#navMobile');
  if (burger && navMobile) {
    const toggle = (open) => {
      const isOpen = open ?? !navMobile.classList.contains('is-open');
      navMobile.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      navMobile.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';   // scroll lock
    };
    burger.addEventListener('click', () => toggle());
    $$('#navMobile a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('is-open')) toggle(false);
    });
  }

  /* ---------- Expertise tabs (Software | Data | Cloud) ---------- */
  const xpTabs = $$('.xp__tab');
  if (xpTabs.length) {
    const xpPanes = $$('.xp__pane');
    const xpPanel = document.querySelector('.xp__panel');
    const activate = (tab) => {
      xpTabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      xpPanes.forEach((p) => p.classList.toggle('is-active', p.id === tab.getAttribute('aria-controls')));
      if (xpPanel && tab.dataset.img) xpPanel.style.setProperty('--xp-img', `url('${tab.dataset.img}')`);
    };
    xpTabs.forEach((t) => t.addEventListener('click', () => activate(t)));
    // legacy anchors (#custom-software, #data-analytics, #cloud) open the matching tab
    const byHash = () => {
      const h = location.hash.replace('#', '');
      if (!h) return;
      const pane = xpPanes.find((p) => p.dataset.anchor === h || p.id === h);
      if (pane) {
        const tab = xpTabs.find((t) => t.getAttribute('aria-controls') === pane.id);
        if (tab) activate(tab);
      }
    };
    byHash();
    window.addEventListener('hashchange', byHash);
  }

  /* ---------- Scroll reveals ---------- */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Count-up statistics ---------- */
  const counters = $$('[data-count]');
  const easings = {
    // large numbers: ease in, measured cadence, gentle settle
    smooth: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    // small counts: even, metronomic beats — each tick lands with rhythm
    linear: (t) => t,
  };
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = parseInt(el.dataset.duration || '3600', 10);
    const ease = easings[el.dataset.ease] || easings.smooth;
    // for a small integer count, step through whole numbers for a rhythmic feel
    const stepInt = (decimals === 0 && target <= 12);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const v = target * ease(p);
      el.textContent = (stepInt ? Math.round(v) : v.toFixed(decimals)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };
  // defer until the page is actually visible (rAF is paused on hidden tabs)
  const animateCount = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    if (document.visibilityState === 'hidden') {
      const onShow = () => {
        if (document.visibilityState !== 'visible') return;
        document.removeEventListener('visibilitychange', onShow);
        runCount(el);
      };
      document.addEventListener('visibilitychange', onShow);
    } else {
      runCount(el);
    }
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => {
      // hero stats count up on page entry; the rest count up when scrolled into view
      if (el.closest('.hero')) { setTimeout(() => animateCount(el), 950); }
      else { cio.observe(el); }
    });
  } else { counters.forEach(animateCount); }

  /* ---------- Chart draw ---------- */
  const chart = $('.chart');
  const line = $('.chart__line');
  if (chart && line) {
    if (reduce) { chart.classList.add('in-view'); line.style.strokeDasharray = '2 8'; }
    else {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len + ' ' + len;
      line.style.strokeDashoffset = String(len);
      line.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)';
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          chart.classList.add('in-view');
          requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; });
          setTimeout(() => { line.style.transition = 'none'; line.style.strokeDasharray = '2 8'; line.style.strokeDashoffset = '0'; }, 1700);
          cio.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      cio.observe(chart);
    }
  }

  /* ---------- Hero parallax ---------- */
  const parallax = $$('[data-parallax]');
  if (parallax.length && !reduce) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax);
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- ✦ Liquid-glass button: pointer light + magnetic pull ---------- */
  $$('.btn').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--mx', mx + '%');
      el.style.setProperty('--my', my + '%');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '120%');
    });
  });

  if (finePointer && !reduce) {
    /* magnetic pull (applied to the few flagged buttons) */
    $$('.magnetic').forEach((el) => {
      const strength = 0.28;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.setProperty('transform', `translateY(-3px) translate(${x * strength}px, ${y * strength}px)`);
      });
      el.addEventListener('mouseleave', () => { el.style.removeProperty('transform'); });
    });

    /* custom cursor dot */
    const dot = $('#cursorDot');
    if (dot) {
      let dx = 0, dy = 0, cx = 0, cy = 0;
      window.addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; dot.style.opacity = '1'; });
      const render = () => {
        cx += (dx - cx) * 0.18; cy += (dy - cy) * 0.18;
        dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
        requestAnimationFrame(render);
      };
      render();
      $$('a, button, .service').forEach((el) => {
        el.addEventListener('mouseenter', () => dot.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => dot.classList.remove('is-hover'));
      });
    }
  }

  /* ---------- Contact form (demo handler) ---------- */
  const form = $('#contactForm');
  if (form) {
    const note = $('#formNote');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = form.querySelector('button[type="submit"]');
      // update only the label so orbit/comet button structure is preserved
      const lbl = btn.querySelector('.cta-orbit__label') || btn;
      const original = lbl.innerHTML;
      lbl.textContent = 'Sending…';
      setTimeout(() => {
        form.reset();
        lbl.textContent = 'Message sent ✓';
        if (note) { note.textContent = 'Thank you — we’ll be in touch within one business day.'; note.style.color = '#9DB4FF'; }
        setTimeout(() => { lbl.innerHTML = original; }, 4000);
      }, 900);
    });
  }
})();
