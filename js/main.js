/* ==========================================================================
   Pimx Branding — interactions & motion (vanilla JS + GSAP/ScrollTrigger)
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Utilities ---------- */
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const mq = {
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)'),
    fine: window.matchMedia('(hover: hover) and (pointer: fine)'),
    desktop: window.matchMedia('(min-width: 901px)'),
    mobile: window.matchMedia('(max-width: 600px)')
  };
  const motionOK = () => hasGSAP && !mq.reduce.matches;
  const isRTL = () => root.dir === 'rtl';
  const dirSign = () => (isRTL() ? -1 : 1);

  // Deterministic pseudo-random, so "misaligned" states are composed rather than chaotic.
  const seeded = (seed) => {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  };
  const between = (rand, min, max) => min + rand() * (max - min);

  const I18N = window.PimxI18n;
  const state = { lang: root.lang === 'ar' ? 'ar' : 'en', menuOpen: false };
  const t = (key) => (I18N ? I18N.t(state.lang, key) : '');

  /* ---------- Language (EN / AR) ---------- */
  function applyLanguage(lang) {
    state.lang = lang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (I18N) I18N.apply(lang);
    try { localStorage.setItem('pimx-lang', lang); } catch (e) { /* storage unavailable */ }
    document.dispatchEvent(new CustomEvent('pimx:langchange', { detail: { lang } }));
  }

  function initLanguage() {
    if (state.lang === 'ar') applyLanguage('ar');

    $$('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = state.lang === 'ar' ? 'en' : 'ar';
        // A ?lang= param would override the stored choice on reload, so drop it.
        const url = new URL(location.href);
        if (url.searchParams.has('lang')) {
          url.searchParams.delete('lang');
          history.replaceState(null, '', url);
        }
        if (!motionOK()) {
          applyLanguage(next);
          if (hasGSAP) ScrollTrigger.refresh();
          return;
        }
        gsap.to(document.body, {
          opacity: 0, duration: 0.25, ease: 'power2.in',
          onComplete() {
            applyLanguage(next);
            ScrollTrigger.refresh();
            gsap.to(document.body, { opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity' });
          }
        });
      });
    });
  }

  /* ---------- Navigation: header states + mobile menu ---------- */
  function initNavigation() {
    const header = $('#site-header');
    const toggle = $('.menu-toggle');
    const menu = $('#mobile-menu');
    const label = $('.menu-toggle__label');
    const inertTargets = [$('#main'), $('#contact')];

    // Header: solid after the top, hides on scroll down, returns on scroll up.
    const updateHeader = (y, direction) => {
      header.classList.toggle('is-scrolled', y > 20);
      if (!state.menuOpen) header.classList.toggle('is-hidden', direction === 1 && y > window.innerHeight * 0.6);
    };
    updateHeader(window.scrollY, 0);

    if (hasGSAP) {
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => updateHeader(self.scroll(), self.direction)
      });

      // Header adopts the colour of the dark sections it passes over.
      const themed = $$('main [data-theme], footer[data-theme]').map((el) => ({
        theme: el.classList.contains('footer') ? 'wine' : 'dark',
        st: ScrollTrigger.create({
          trigger: el,
          start: () => `top ${header.offsetHeight / 2}`,
          end: () => `bottom ${header.offsetHeight / 2}`,
          onToggle: () => syncTheme()
        })
      }));
      const syncTheme = () => {
        const active = themed.find((x) => x.st.isActive);
        if (active) header.dataset.theme = active.theme;
        else delete header.dataset.theme;
      };
    } else {
      let last = window.scrollY;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        updateHeader(y, y > last ? 1 : -1);
        last = y;
      }, { passive: true });
    }

    // Mobile menu
    const links = $$('.mobile-menu__list a, .mobile-menu__foot > *', menu);

    const setMenu = (open) => {
      if (open === state.menuOpen) return;
      state.menuOpen = open;
      toggle.setAttribute('aria-expanded', String(open));
      label.dataset.i18n = open ? 'nav.close' : 'nav.menu';
      label.textContent = t(label.dataset.i18n) || (open ? 'Close' : 'Menu');
      header.classList.toggle('menu-open', open);
      header.classList.remove('is-hidden');
      root.style.overflow = open ? 'hidden' : '';
      inertTargets.forEach((el) => { if (el) el.inert = open; });

      if (open) {
        menu.hidden = false;
        if (motionOK()) {
          gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' });
          gsap.fromTo(links, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.25 });
        }
        links[0] && links[0].focus({ preventScroll: true });
      } else {
        const hide = () => { menu.hidden = true; };
        if (motionOK()) {
          gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: hide });
        } else hide();
      }
    };

    toggle.addEventListener('click', () => {
      const wasOpen = state.menuOpen;
      setMenu(!wasOpen);
      if (wasOpen) toggle.focus();
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.menuOpen) { setMenu(false); toggle.focus(); }
    });
    mq.desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    document.addEventListener('pimx:langchange', () => {
      label.textContent = t(label.dataset.i18n);
    });
  }

  /* ---------- Smooth anchor scrolling (native, no extra library) ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (hash === '#') { e.preventDefault(); return; }
      const target = hash === '#top' ? document.body : $(hash);
      if (!target) return;

      e.preventDefault();
      const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: mq.reduce.matches ? 'auto' : 'smooth' });
      history.pushState(null, '', hash);

      // Move keyboard focus with the scroll.
      const focusEl = hash === '#top' ? $('#main') : target;
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    });
  }

  /* ---------- Hero: page-load timeline ---------- */
  function initHeroAnimation() {
    if (!motionOK()) return;
    const rand = seeded(11);
    const blocks = $$('.fit-comp__blk');

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
    tl.fromTo('.hero__title .line__inner', { yPercent: 140, y: 0 }, { yPercent: 0, duration: 1.25, stagger: 0.09 }, 0)
      .fromTo('.hero__title', { x: 40 * dirSign() }, { x: 0, duration: 1.8, ease: 'power4.out', clearProps: 'transform' }, 0)
      .fromTo('.site-header [data-nav-item]', { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out', clearProps: 'transform' }, 0.35)
      .fromTo('.fit-comp__grid, .crop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.25)
      .fromTo(blocks, {
        autoAlpha: 0,
        x: () => between(rand, -30, 30),
        y: () => between(rand, -30, 30),
        rotation: () => between(rand, -12, 12)
      }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.5, stagger: 0.07 }, 0.4)
      .fromTo('[data-hero-fade]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06, ease: 'power3.out' }, 0.5)
      .fromTo('.hero__cta', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', clearProps: 'transform' }, 0.7);

    // Gentle parallax as the hero leaves.
    gsap.to('.hero__visual', {
      yPercent: -22, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Scroll reveals & the "fitting" moments ---------- */
  function revealLines() {
    $$('[data-reveal="lines"]').forEach((el) => {
      gsap.fromTo($$('.line__inner', el), { yPercent: 140, y: 0 }, {
        yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  function revealFades() {
    ScrollTrigger.batch('[data-reveal="fade"]', {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 })
    });
  }

  function revealClients() {
    ScrollTrigger.batch('.client', {
      start: 'top 92%', once: true,
      onEnter: (batch) => {
        gsap.fromTo(batch, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out', stagger: 0.07 });
        gsap.fromTo(batch.map((c) => $('img', c)), { y: 18, scale: 0.96 }, { y: 0, scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.07, clearProps: 'transform' });
      }
    });
  }

  // Fit moment #2: scattered modules settle into a precise grid as you scroll.
  function fitGrid() {
    const shapes = $$('.fit-grid .sh');
    const rand = seeded(42);
    const amp = mq.mobile.matches ? 16 : 44;
    gsap.fromTo(shapes, {
      x: () => between(rand, -amp, amp),
      y: () => between(rand, -amp, amp),
      rotation: () => between(rand, -28, 28),
      scale: () => between(rand, 0.72, 1.12)
    }, {
      x: 0, y: 0, rotation: 0, scale: 1, ease: 'none',
      stagger: { each: 0.015, from: 'random' },
      scrollTrigger: { trigger: '.fit-grid', start: 'top 95%', end: 'center 55%', scrub: 1 }
    });
  }

  function revealProjects() {
    const cards = $$('.project');
    const cols = mq.desktop.matches ? 3 : (mq.mobile.matches ? 1 : 2);
    const offsets = [70, 120, 90];

    cards.forEach((card, i) => {
      const col = i % cols;
      const media = $('.project__media', card);
      const img = $('.project__img', card);
      const info = $('.project__info', card);

      // Each image "fits" into its frame: the clip opens while the image settles.
      gsap.timeline({ delay: col * 0.09, scrollTrigger: { trigger: card, start: 'top 92%', once: true } })
        .set(card, { autoAlpha: 1 })
        .fromTo(media, { clipPath: 'inset(9% 9% 9% 9%)', y: offsets[col] }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5, ease: 'expo.out', clearProps: 'clipPath' })
        .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
        .fromTo(info, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.3);
    });

    // Subtle depth on desktop: the middle column drifts slightly slower.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1101px)', () => {
      cards.filter((_, i) => i % 3 === 1).forEach((card) => {
        gsap.fromTo(card, { y: 40 }, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    });
  }

  function revealServices() {
    ScrollTrigger.batch('.svc', {
      start: 'top 92%', once: true,
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' })
    });
  }

  // Fit moment #3: the wordmark letters arrive off-baseline and lock into line.
  function fitWordmark() {
    const letters = $$('.footer__wordmark span');
    const rand = seeded(7);
    gsap.fromTo(letters, {
      autoAlpha: 1,
      yPercent: () => between(rand, -38, 38),
      rotation: () => between(rand, -6, 6)
    }, {
      yPercent: 0, rotation: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer__wordmark', start: 'top bottom', end: 'bottom bottom', scrub: 1 }
    });
  }

  function initScrollAnimations() {
    if (!motionOK()) return;
    revealLines();
    revealFades();
    revealClients();
    fitGrid();
    revealProjects();
    revealServices();
    fitWordmark();
  }

  /* ---------- Project hover ---------- */
  function initProjectInteractions() {
    if (!motionOK() || !mq.fine.matches) return;

    $$('.project__link').forEach((link) => {
      const imgs = $$('.project__img', link);
      const alt = $('.project__img--alt', link);
      const title = $('.project__title', link);
      const num = $('.project__num', link);

      const enter = () => {
        gsap.to(imgs, { scale: 1.06, duration: 1.2, ease: 'expo.out', overwrite: 'auto' });
        gsap.fromTo(alt, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut', overwrite: true });
        gsap.to([title, num], { x: 8 * dirSign(), duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
      };
      const leave = () => {
        gsap.to(imgs, { scale: 1, duration: 1.2, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(alt, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut', overwrite: true });
        gsap.to([title, num], { x: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
      };

      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);
      link.addEventListener('focus', enter);
      link.addEventListener('blur', leave);
    });
  }

  /* ---------- Services: editorial accordion + hover preview ---------- */
  function initServiceInteractions() {
    const list = $('.svc-list');
    if (!list) return;
    const items = $$('.svc', list);
    const hoverMode = () => mq.fine.matches && mq.desktop.matches;
    let active = null;

    // Preview: one stacked image per service, so swaps are instant.
    const preview = $('.svc-preview');
    const frame = $('.svc-preview__frame', preview);
    frame.innerHTML = '';
    const previewImgs = items.map((item) => {
      const img = new Image();
      img.src = item.dataset.preview;
      img.alt = '';
      img.decoding = 'async';
      img.className = 'svc-preview__img';
      Object.assign(img.style, { position: 'absolute', inset: '0', clipPath: 'inset(100% 0% 0% 0%)' });
      frame.appendChild(img);
      return img;
    });
    frame.style.position = 'relative';

    const anim = (target, vars) => (hasGSAP ? gsap.to(target, { ...vars, duration: motionOK() ? vars.duration : 0 }) : null);

    function open(item) {
      if (active === item) return;
      if (active) close(active);
      active = item;
      const btn = $('.svc__head', item);
      const body = $('.svc__body', item);
      const inner = $('.svc__body-inner', item);

      item.classList.add('is-active');
      list.classList.add('has-active');
      btn.setAttribute('aria-expanded', 'true');

      if (!hasGSAP) {
        body.style.height = 'auto';
        inner.style.visibility = 'visible';
        return;
      }
      anim(body, { height: 'auto', duration: 0.8, ease: 'expo.out', overwrite: true });
      gsap.fromTo(inner, { autoAlpha: 0, y: motionOK() ? 12 : 0 }, { autoAlpha: 1, y: 0, duration: motionOK() ? 0.7 : 0, delay: motionOK() ? 0.1 : 0, ease: 'power3.out', overwrite: true });
      anim($('.svc__icon', item), { rotation: 45 * dirSign(), duration: 0.6, ease: 'expo.out' });
      if (hoverMode()) anim($('.svc__title', item), { x: 22 * dirSign(), duration: 0.8, ease: 'expo.out' });
    }

    function close(item) {
      const btn = $('.svc__head', item);
      const body = $('.svc__body', item);
      const inner = $('.svc__body-inner', item);
      item.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
      if (active === item) active = null;
      if (!active) list.classList.remove('has-active');

      if (!hasGSAP) {
        body.style.height = '0px';
        inner.style.visibility = 'hidden';
        return;
      }
      anim(body, { height: 0, duration: 0.6, ease: 'expo.out', overwrite: true });
      anim(inner, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
      anim($('.svc__icon', item), { rotation: 0, duration: 0.6, ease: 'expo.out' });
      anim($('.svc__title', item), { x: 0, duration: 0.8, ease: 'expo.out' });
    }

    // Keyboard and touch: button toggles. Mouse clicks on desktop are handled by hover.
    items.forEach((item) => {
      $('.svc__head', item).addEventListener('click', (e) => {
        if (hoverMode() && e.detail > 0) return;
        active === item ? close(item) : open(item);
      });
    });

    // Desktop hover behaviour
    if (hasGSAP && mq.fine.matches) {
      const xTo = gsap.quickTo(preview, 'x', { duration: motionOK() ? 0.6 : 0, ease: 'power3' });
      const yTo = gsap.quickTo(preview, 'y', { duration: motionOK() ? 0.6 : 0, ease: 'power3' });
      let shownIndex = -1;
      let previewVisible = false;
      let zIndex = 1;

      const placePreview = (e) => {
        const w = preview.offsetWidth;
        const x = isRTL() ? e.clientX - w - 40 : e.clientX + 40;
        xTo(Math.max(12, Math.min(window.innerWidth - w - 12, x)));
        yTo(e.clientY - preview.offsetHeight / 2);
      };

      const showPreview = (index, e) => {
        if (!hoverMode()) return;
        if (!previewVisible) {
          const w = preview.offsetWidth;
          gsap.set(preview, { x: isRTL() ? e.clientX - w - 40 : e.clientX + 40, y: e.clientY - preview.offsetHeight / 2 });
          gsap.fromTo(preview, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: motionOK() ? 0.5 : 0, ease: 'expo.out', overwrite: 'auto' });
          previewVisible = true;
        }
        if (index === shownIndex) return;
        const img = previewImgs[index];
        img.style.zIndex = String(++zIndex);
        gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: motionOK() ? 0.7 : 0, ease: 'expo.out', overwrite: true });
        shownIndex = index;
      };

      const hidePreview = () => {
        previewVisible = false;
        shownIndex = -1;
        gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: motionOK() ? 0.35 : 0, ease: 'power2.out', overwrite: 'auto' });
      };

      items.forEach((item, i) => {
        item.addEventListener('mouseenter', (e) => {
          if (!hoverMode()) return;
          open(item);
          showPreview(i, e);
        });
      });
      list.addEventListener('mousemove', (e) => { if (previewVisible) placePreview(e); });

      // Scrolling can carry the list away from a still pointer without a mouseleave.
      const pointer = { x: -1, y: -1 };
      window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!previewVisible || ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const under = document.elementFromPoint(pointer.x, pointer.y);
          const item = under && under.closest('.svc');
          if (!item || !list.contains(item)) {
            if (active) close(active);
            hidePreview();
          } else if (item !== active) {
            open(item);
            showPreview(items.indexOf(item), { clientX: pointer.x, clientY: pointer.y });
          }
        });
      }, { passive: true });
      list.addEventListener('mouseleave', () => {
        if (!hoverMode()) return;
        if (active) close(active);
        hidePreview();
      });
    }

    document.addEventListener('pimx:langchange', () => { if (active) close(active); });
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  function initCursor() {
    if (!hasGSAP || !mq.fine.matches) return;
    const cursor = $('.cursor');
    if (!cursor) return;
    root.classList.add('has-cursor');

    const fast = mq.reduce.matches ? 0 : 0.16;
    const xTo = gsap.quickTo(cursor, 'x', { duration: fast, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: fast, ease: 'power3' });
    let visible = false;

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        cursor.classList.add('is-visible');
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });

    const setMode = (el) => {
      if (!el || !el.closest) return;
      const tagged = el.closest('[data-cursor]');
      const mode = tagged ? tagged.dataset.cursor : (el.closest('a, button') ? 'cta' : '');
      cursor.classList.toggle('is-view', mode === 'view');
      cursor.classList.toggle('is-cta', mode === 'cta');
      cursor.classList.toggle('on-dark', !!el.closest('[data-theme]'));
    };
    document.addEventListener('mouseover', (e) => setMode(e.target));

    // Content moves under a still pointer while scrolling; re-check what's beneath it.
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setMode(document.elementFromPoint(gsap.getProperty(cursor, 'x'), gsap.getProperty(cursor, 'y')));
        ticking = false;
      });
    }, { passive: true });

    document.addEventListener('mouseleave', () => { cursor.classList.remove('is-visible'); visible = false; });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  }

  /* ---------- CTA micro-interaction: subtle magnetic pull ---------- */
  function initMagnetic() {
    if (!motionOK() || !mq.fine.matches) return;
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      let rect = null;
      el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) return;
        xTo((e.clientX - (rect.left + rect.width / 2)) * 0.22);
        yTo((e.clientY - (rect.top + rect.height / 2)) * 0.3);
      });
      el.addEventListener('pointerleave', () => { rect = null; xTo(0); yTo(0); });
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    initLanguage();

    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ nullTargetWarn: false });
    } else {
      root.classList.remove('motion');
    }
    if (mq.reduce.matches) root.classList.remove('motion');

    root.classList.remove('is-loading');
    window.__pimxReady = true;

    $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

    initNavigation();
    initSmoothScroll();
    initHeroAnimation();
    initScrollAnimations();
    initProjectInteractions();
    initServiceInteractions();
    initCursor();
    initMagnetic();

    if (hasGSAP && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
