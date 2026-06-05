/* ============================================================
   JSTLIKEHOME — STR Consulting · interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 8) { header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close menu when a link is tapped
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contact form ----
     No backend required: opens the visitor's email client with a
     pre-filled message to Roy. To use a hosted form service instead
     (e.g. Formspree), see the note in README.md. */
  var form = document.getElementById('contact-form');
  var hint = document.getElementById('form-hint');
  var CONTACT_EMAIL = 'hello@jstlikehome.com'; // <-- change to your real email

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (form.name.value || '').trim();
      var email = (form.email.value || '').trim();
      var props = (form.props.value || '').trim();
      var message = (form.message.value || '').trim();

      if (!name || !email || !message) {
        showHint('Please fill in your name, email and message.', 'err');
        return;
      }

      var subject = 'STR Consulting enquiry from ' + name;
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Number of properties: ' + (props || 'N/A') + '\n\n' +
        message + '\n';

      var mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
      showHint('Opening your email app… if nothing happens, email ' + CONTACT_EMAIL + ' directly.', 'ok');
      form.reset();
    });
  }

  function showHint(msg, type) {
    if (!hint) { return; }
    hint.textContent = msg;
    hint.className = 'form-hint ' + (type || '');
  }
})();
