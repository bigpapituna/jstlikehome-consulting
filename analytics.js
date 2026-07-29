// GA4 + lead tracking. The Measurement ID is public by design (it ships in page source).
(function () {
  var ID = 'G-HBJ1SXL0YD';

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID);

  // Emailing Roy is the only conversion this site has, so count it as one.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (a) gtag('event', 'contact_click', { link_url: a.getAttribute('href') });
  });
})();
