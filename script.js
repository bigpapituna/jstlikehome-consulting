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

  /* ---- Calendly: lazy-load the inline embed where present (About, /book) ---- */
  if (document.querySelector('.calendly-inline-widget')) {
    var calCss = document.createElement('link');
    calCss.rel = 'stylesheet';
    calCss.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(calCss);
    var calJs = document.createElement('script');
    calJs.src = 'https://assets.calendly.com/assets/external/widget.js';
    document.head.appendChild(calJs);
  }

  /* ---- Sticky mobile booking bar (home) ---- */
  var bookbar = document.getElementById('bookbar');
  if (bookbar) {
    var onBarScroll = function () { bookbar.classList.toggle('show', window.scrollY > 640); };
    window.addEventListener('scroll', onBarScroll, { passive: true });
    onBarScroll();
  }

  /* ---- Anchor nav highlight (home one-pager) ---- */
  var anchors = document.querySelectorAll('.main-nav a[href^="#"]');
  if (anchors.length && 'IntersectionObserver' in window) {
    var byId = {};
    anchors.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (a) { a.classList.toggle('on', e.isIntersecting); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) { secObs.observe(s); }
    });
  }
})();
