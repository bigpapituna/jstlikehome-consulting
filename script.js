/* ============================================================
   JSTLIKEHOME · Vacation Rental Consulting — interactions (shared)
   ============================================================ */
(function () {
  'use strict';

  /* ---- Year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-decimals')) ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    if (prefersReduced) { el.textContent = target.toFixed(decimals); return; }
    var dur = 1500, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) { requestAnimationFrame(tick); }
      else { el.textContent = target.toFixed(decimals); }
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) { return; }
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close siblings
      document.querySelectorAll('.faq__item.open').forEach(function (o) {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.faq__a').style.maxHeight = null; o.querySelector('.faq__q').setAttribute('aria-expanded', 'false'); }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = isOpen ? null : a.scrollHeight + 'px';
    });
  });

  /* ---- Calendly: lazy-load, inline embed where present, popup on booking CTAs ---- */
  var CAL_URL = 'https://calendly.com/roy-y-jstlikehome/30min?hide_gdpr_banner=1&primary_color=e63946';
  var calLoading = false, calWaiting = [];
  function loadCalendly(cb) {
    if (window.Calendly) { if (cb) cb(); return; }
    if (cb) calWaiting.push(cb);
    if (calLoading) return;
    calLoading = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.onload = function () { calWaiting.forEach(function (f) { f(); }); calWaiting = []; };
    document.head.appendChild(js);
  }
  // Inline embed on this page (About) — load so it renders.
  if (document.querySelector('.calendly-inline-widget')) { loadCalendly(); }
  // Booking CTAs (all point to #contact) — open the Calendly popup instead of navigating.
  document.querySelectorAll('a[href$="#contact"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      loadCalendly(function () { window.Calendly.initPopupWidget({ url: CAL_URL }); });
    });
  });
})();
