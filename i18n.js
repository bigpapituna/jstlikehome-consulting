/* ============================================================
   JSTLIKEHOME — lightweight site-wide language switcher
   English is the source in the HTML. French/Spanish are swapped
   in at the text-node level (no build step, no per-element tags).
   Anything not in the dictionary stays English (graceful fallback).
   Choice is remembered in localStorage across pages.
   ============================================================ */
(function () {
  'use strict';

  var LANGS = [['en', 'EN'], ['fr', 'FR'], ['es', 'ES']];
  var STORE = 'jlh_lang';

  /* ----- Translations: keyed by the trimmed, whitespace-collapsed
     English text of each text node. Shared strings (nav, footer,
     CTAs, trust bar) are reused across every page. ----- */
  var DICT = {
    fr: {
      // --- shared: nav / brand ---
      'Vacation Rental Consulting': 'Conseil en location de vacances',
      'Home': 'Accueil',
      'Services': 'Services',
      'About': 'À propos',
      'Book a call': 'Réserver un appel',
      // --- shared: trust bar ---
      'Preferred partner & power user across the major platforms & pricing tools': 'Partenaire privilégié et utilisateur expert des principales plateformes et outils de tarification',
      '★ Preferred Partner': '★ Partenaire privilégié',
      '★ Expert Partner': '★ Partenaire expert',
      '★ Premium Partner': '★ Partenaire Premium',
      '★ Expert': '★ Expert',
      // --- shared: CTA band ---
      "Ready to maximize your rental's revenue?": 'Prêt à maximiser les revenus de votre location ?',
      "Let's find the money your listings are leaving on the table. Book a complimentary, no-pressure strategy call.": 'Trouvons l’argent que vos annonces laissent sur la table. Réservez un appel stratégique gratuit, sans engagement.',
      'Book a complimentary strategy call': 'Réserver un appel stratégique gratuit',
      'Email Roy': 'Écrire à Roy',
      'Explore services': 'Découvrir les services',
      // --- shared: footer ---
      'Premium vacation rental consulting: dynamic pricing, listing optimization & automation for hosts and portfolios worldwide.': 'Conseil premium en location de vacances : tarification dynamique, optimisation des annonces et automatisation pour les hôtes et portefeuilles du monde entier.',
      'Company': 'Entreprise',
      'Get started': 'Commencer',
      'Dynamic Pricing': 'Tarification dynamique',
      'Listing Optimization': 'Optimisation des annonces',
      'Channel & OTA': 'Canaux et OTA',
      'Hostaway & Automation': 'Hostaway et automatisation',
      'Audits & Training': 'Audits et formation',
      'About Roy': 'À propos de Roy',
      'Pricing': 'Tarifs',
      'Contact': 'Contact',
      'Book a strategy call': 'Réserver un appel stratégique',
      'Built for hosts who refuse to leave money on the table.': 'Conçu pour les hôtes qui refusent de laisser de l’argent sur la table.',

      // --- home: hero ---
      'Airbnb & Vacation Rental Consulting': 'Conseil Airbnb et location de vacances',
      "Unlock your rental's": 'Libérez le',
      'full earning potential.': 'plein potentiel de revenus de votre location.',
      "I'm Roy, a vacation rental consultant with": 'Je suis Roy, consultant en location de vacances fort de',
      '12+ years': '12+ ans',
      "optimizing Airbnb & short-term rentals worldwide. I've built and managed": 'd’optimisation d’annonces Airbnb et de locations courte durée dans le monde entier. J’ai créé et géré',
      '72 of my own properties': '72 de mes propres logements',
      ', and I help hosts and portfolios win with smarter pricing, sharper listings, and automation that scales.': ', et j’aide les hôtes et les portefeuilles à gagner grâce à une tarification plus intelligente, des annonces plus percutantes et une automatisation qui passe à l’échelle.',
      'Trusted by hosts on 5 continents': 'La confiance d’hôtes sur 5 continents',
      'revenue managed': 'revenus gérés',
      'avg revenue': 'revenu moyen',
      'Optimizing listings across Canada, USA, Bali, NZ & Europe': 'Optimisation d’annonces au Canada, aux États-Unis, à Bali, en Nouvelle-Zélande et en Europe',

      // --- home: stat labels ---
      'Years optimizing vacation rentals': 'Années d’optimisation de locations',
      'Properties personally built & managed': 'Logements créés et gérés personnellement',
      'Listings optimized worldwide': 'Annonces optimisées dans le monde',
      'Continents of active clients': 'Continents de clients actifs',

      // --- home: services ---
      'What I do': 'Ce que je fais',
      'Full-service optimization for serious hosts': 'Optimisation complète pour les hôtes sérieux',
      'From a single listing to a multi-property portfolio, I cover the entire revenue engine: pricing, listings, channels, and automation.': 'D’une annonce unique à un portefeuille de plusieurs logements, je couvre tout le moteur de revenus : tarification, annonces, canaux et automatisation.',
      'Dynamic Pricing & Revenue': 'Tarification dynamique et revenus',
      'Data-driven pricing with PriceLabs, Beyond Pricing & Wheelhouse, tuned to market demand, seasonality and competitor ADR to win every night.': 'Tarification basée sur les données avec PriceLabs, Beyond Pricing et Wheelhouse, ajustée à la demande du marché, à la saisonnalité et aux tarifs des concurrents pour remporter chaque nuit.',
      'Learn more': 'En savoir plus',
      'Listing Optimization': 'Optimisation des annonces',
      'Titles, descriptions, photo order, amenities and settings tuned for search ranking and conversion across Airbnb, VRBO, Booking.com & Expedia.': 'Titres, descriptions, ordre des photos, équipements et réglages optimisés pour le classement et la conversion sur Airbnb, VRBO, Booking.com et Expedia.',
      'Channel & OTA Expansion': 'Expansion des canaux et OTA',
      'Get listed, synced and optimized across all major OTAs, using preferred-partner positioning to expand reach without double bookings.': 'Soyez référencé, synchronisé et optimisé sur toutes les grandes OTA, avec un positionnement de partenaire privilégié pour élargir votre portée sans doubles réservations.',
      'Hostaway Setup & Automation': 'Configuration Hostaway et automatisation',
      'Build listings, channel manager, automated guest messaging and documented SOPs so your operation scales with your team.': 'Création des annonces, gestionnaire de canaux, messagerie automatisée aux voyageurs et procédures documentées pour que votre activité grandisse avec votre équipe.',
      'Occupancy & Booking-Gap Strategy': 'Stratégie d’occupation et de créneaux vides',
      'Targeted promotions, smart minimum-stay rules and last-minute pricing that fill the gaps in your calendar without sacrificing profit.': 'Promotions ciblées, règles de séjour minimum intelligentes et tarifs de dernière minute pour combler les trous de votre calendrier sans sacrifier la rentabilité.',
      'Audits, Coaching & Training': 'Audits, coaching et formation',
      'Full account audits, growth roadmaps and step-by-step documentation to train your team and keep performance climbing long after we start.': 'Audits complets du compte, feuilles de route de croissance et documentation pas à pas pour former votre équipe et faire progresser les performances bien après notre démarrage.',

      // --- home: results ---
      'Proven results': 'Résultats prouvés',
      'Listings transformed into high-performing assets': 'Des annonces transformées en actifs performants',
      'Real results from the portfolios I work with.': 'Des résultats concrets issus des portefeuilles que je gère.',
      'Luxury villa · New Zealand': 'Villa de luxe · Nouvelle-Zélande',
      'Repositioned & repriced for peak-season demand': 'Repositionnée et retarifée pour la haute saison',
      'Average revenue lift in the first 90 days': 'Hausse moyenne des revenus sur les 90 premiers jours',
      'City apartment · Canada': 'Appartement urbain · Canada',
      'Beach villa · Bali': 'Villa de plage · Bali',
      'Occupancy on a previously underbooked calendar': 'Occupation sur un calendrier auparavant sous-réservé',

      // --- home: feature (pricing) ---
      '01 · REVENUE MANAGEMENT': '01 · GESTION DES REVENUS',
      'Pricing that captures every dollar of demand': 'Une tarification qui capte chaque dollar de demande',
      'I build a custom dynamic-pricing strategy around your market, your property, and the booking windows that convert, then refine it continuously.': 'Je construis une stratégie de tarification dynamique sur mesure autour de votre marché, de votre logement et des fenêtres de réservation qui convertissent, puis je l’affine en continu.',
      'Market & competitor ADR analysis, refreshed regularly': 'Analyse du marché et des tarifs concurrents, actualisée régulièrement',
      'Seasonality, events & demand-based rate rules': 'Règles de tarif selon la saison, les événements et la demande',
      'Gap-filling, last-minute & orphan-night strategy': 'Stratégie de remplissage, de dernière minute et de nuits orphelines',
      'Minimum-stay tuning to protect profit, not just occupancy': 'Réglage du séjour minimum pour protéger la rentabilité, pas seulement l’occupation',
      'See how it works': 'Voir comment ça marche',
      'revenue': 'revenus',

      // --- home: process ---
      'How it works': 'Comment ça marche',
      'A clear path from audit to optimized revenue': 'Un parcours clair, de l’audit aux revenus optimisés',
      'Audit': 'Audit',
      'I review your listings, pricing, channels and data to find where revenue is leaking.': 'J’examine vos annonces, votre tarification, vos canaux et vos données pour repérer où fuient les revenus.',
      'Strategy': 'Stratégie',
      'A tailored plan for pricing, listing optimization and channel mix, built around your market and goals.': 'Un plan sur mesure pour la tarification, l’optimisation des annonces et le mix de canaux, conçu autour de votre marché et de vos objectifs.',
      'Implementation': 'Mise en œuvre',
      'I set up the tools, rewrite the listings, configure automation and put the strategy live.': 'Je configure les outils, réécris les annonces, paramètre l’automatisation et lance la stratégie.',
      'Optimization': 'Optimisation',
      'Ongoing monitoring and adjustments to keep occupancy, ADR and revenue trending up.': 'Suivi et ajustements continus pour faire progresser l’occupation, l’ADR et les revenus.',

      // --- home: testimonials ---
      'What clients say': 'Ce que disent les clients',
      'Hosts who stopped leaving money on the table': 'Des hôtes qui ont cessé de laisser de l’argent sur la table',
      "Roy isn't cheap, and he tells you that up front, but he made it back in the first month. Our revenue is up sharply and I finally understand my own pricing.": 'Roy n’est pas donné, et il le dit d’emblée, mais il s’est remboursé dès le premier mois. Nos revenus ont fortement augmenté et je comprends enfin ma propre tarification.',
      'Superhost · Queenstown, NZ': 'Superhost · Queenstown, NZ',
      'We brought Roy in for our 7-listing portfolio. The Hostaway setup and pricing overhaul paid for itself almost immediately. Easily our best consulting spend.': 'Nous avons fait appel à Roy pour notre portefeuille de 7 annonces. La configuration Hostaway et la refonte tarifaire se sont rentabilisées presque aussitôt. Sans conteste notre meilleur investissement en conseil.',
      'Portfolio Host · Bali': 'Hôte de portefeuille · Bali',
      'Ten years of experience shows. He moved faster than the two consultants we tried before, and the occupancy on our slow season is unrecognizable.': 'Dix ans d’expérience, ça se voit. Il a avancé plus vite que les deux consultants essayés avant lui, et l’occupation de notre basse saison est méconnaissable.',
      'Owners · Tuscany, Italy': 'Propriétaires · Toscane, Italie'
    },

    es: {
      // --- shared: nav / brand ---
      'Vacation Rental Consulting': 'Consultoría de alquiler vacacional',
      'Home': 'Inicio',
      'Services': 'Servicios',
      'About': 'Acerca de',
      'Book a call': 'Reservar una llamada',
      // --- shared: trust bar ---
      'Preferred partner & power user across the major platforms & pricing tools': 'Socio preferente y usuario experto de las principales plataformas y herramientas de precios',
      '★ Preferred Partner': '★ Socio preferente',
      '★ Expert Partner': '★ Socio experto',
      '★ Premium Partner': '★ Socio Premium',
      '★ Expert': '★ Experto',
      // --- shared: CTA band ---
      "Ready to maximize your rental's revenue?": '¿Listo para maximizar los ingresos de su alquiler?',
      "Let's find the money your listings are leaving on the table. Book a complimentary, no-pressure strategy call.": 'Encontremos el dinero que sus anuncios están dejando sobre la mesa. Reserve una llamada estratégica gratuita y sin compromiso.',
      'Book a complimentary strategy call': 'Reserve una llamada estratégica gratuita',
      'Email Roy': 'Escribir a Roy',
      'Explore services': 'Explorar servicios',
      // --- shared: footer ---
      'Premium vacation rental consulting: dynamic pricing, listing optimization & automation for hosts and portfolios worldwide.': 'Consultoría premium de alquiler vacacional: precios dinámicos, optimización de anuncios y automatización para anfitriones y portafolios de todo el mundo.',
      'Company': 'Empresa',
      'Get started': 'Empezar',
      'Dynamic Pricing': 'Precios dinámicos',
      'Listing Optimization': 'Optimización de anuncios',
      'Channel & OTA': 'Canales y OTA',
      'Hostaway & Automation': 'Hostaway y automatización',
      'Audits & Training': 'Auditorías y formación',
      'About Roy': 'Sobre Roy',
      'Pricing': 'Precios',
      'Contact': 'Contacto',
      'Book a strategy call': 'Reservar una llamada estratégica',
      'Built for hosts who refuse to leave money on the table.': 'Hecho para anfitriones que se niegan a dejar dinero sobre la mesa.',

      // --- home: hero ---
      'Airbnb & Vacation Rental Consulting': 'Consultoría de Airbnb y alquiler vacacional',
      "Unlock your rental's": 'Libere todo el',
      'full earning potential.': 'potencial de ingresos de su alquiler.',
      "I'm Roy, a vacation rental consultant with": 'Soy Roy, consultor de alquiler vacacional con',
      '12+ years': '12+ años',
      "optimizing Airbnb & short-term rentals worldwide. I've built and managed": 'optimizando Airbnb y alquileres de corta estancia en todo el mundo. He creado y gestionado',
      '72 of my own properties': '72 propiedades propias',
      ', and I help hosts and portfolios win with smarter pricing, sharper listings, and automation that scales.': ', y ayudo a anfitriones y portafolios a ganar con precios más inteligentes, anuncios más afilados y automatización que escala.',
      'Trusted by hosts on 5 continents': 'La confianza de anfitriones en 5 continentes',
      'revenue managed': 'ingresos gestionados',
      'avg revenue': 'ingreso medio',
      'Optimizing listings across Canada, USA, Bali, NZ & Europe': 'Optimizando anuncios en Canadá, EE. UU., Bali, Nueva Zelanda y Europa',

      // --- home: stat labels ---
      'Years optimizing vacation rentals': 'Años optimizando alquileres vacacionales',
      'Properties personally built & managed': 'Propiedades creadas y gestionadas personalmente',
      'Listings optimized worldwide': 'Anuncios optimizados en el mundo',
      'Continents of active clients': 'Continentes con clientes activos',

      // --- home: services ---
      'What I do': 'Lo que hago',
      'Full-service optimization for serious hosts': 'Optimización integral para anfitriones serios',
      'From a single listing to a multi-property portfolio, I cover the entire revenue engine: pricing, listings, channels, and automation.': 'Desde un solo anuncio hasta un portafolio de varias propiedades, cubro todo el motor de ingresos: precios, anuncios, canales y automatización.',
      'Dynamic Pricing & Revenue': 'Precios dinámicos e ingresos',
      'Data-driven pricing with PriceLabs, Beyond Pricing & Wheelhouse, tuned to market demand, seasonality and competitor ADR to win every night.': 'Precios basados en datos con PriceLabs, Beyond Pricing y Wheelhouse, ajustados a la demanda del mercado, la estacionalidad y las tarifas de la competencia para ganar cada noche.',
      'Learn more': 'Saber más',
      'Listing Optimization': 'Optimización de anuncios',
      'Titles, descriptions, photo order, amenities and settings tuned for search ranking and conversion across Airbnb, VRBO, Booking.com & Expedia.': 'Títulos, descripciones, orden de fotos, servicios y ajustes optimizados para el posicionamiento y la conversión en Airbnb, VRBO, Booking.com y Expedia.',
      'Channel & OTA Expansion': 'Expansión de canales y OTA',
      'Get listed, synced and optimized across all major OTAs, using preferred-partner positioning to expand reach without double bookings.': 'Publíquese, sincronícese y optimícese en todas las grandes OTA, con posicionamiento de socio preferente para ampliar el alcance sin dobles reservas.',
      'Hostaway Setup & Automation': 'Configuración de Hostaway y automatización',
      'Build listings, channel manager, automated guest messaging and documented SOPs so your operation scales with your team.': 'Creación de anuncios, gestor de canales, mensajería automatizada a huéspedes y procedimientos documentados para que su operación crezca con su equipo.',
      'Occupancy & Booking-Gap Strategy': 'Estrategia de ocupación y huecos',
      'Targeted promotions, smart minimum-stay rules and last-minute pricing that fill the gaps in your calendar without sacrificing profit.': 'Promociones dirigidas, reglas inteligentes de estancia mínima y precios de última hora que llenan los huecos de su calendario sin sacrificar el beneficio.',
      'Audits, Coaching & Training': 'Auditorías, coaching y formación',
      'Full account audits, growth roadmaps and step-by-step documentation to train your team and keep performance climbing long after we start.': 'Auditorías completas de la cuenta, hojas de ruta de crecimiento y documentación paso a paso para formar a su equipo y mantener el rendimiento en alza mucho después de empezar.',

      // --- home: results ---
      'Proven results': 'Resultados comprobados',
      'Listings transformed into high-performing assets': 'Anuncios transformados en activos de alto rendimiento',
      'Real results from the portfolios I work with.': 'Resultados reales de los portafolios que gestiono.',
      'Luxury villa · New Zealand': 'Villa de lujo · Nueva Zelanda',
      'Repositioned & repriced for peak-season demand': 'Reposicionada y re-tarifada para la temporada alta',
      'Average revenue lift in the first 90 days': 'Aumento medio de ingresos en los primeros 90 días',
      'City apartment · Canada': 'Apartamento urbano · Canadá',
      'Beach villa · Bali': 'Villa de playa · Bali',
      'Occupancy on a previously underbooked calendar': 'Ocupación en un calendario antes infrautilizado',

      // --- home: feature (pricing) ---
      '01 · REVENUE MANAGEMENT': '01 · GESTIÓN DE INGRESOS',
      'Pricing that captures every dollar of demand': 'Precios que capturan cada dólar de demanda',
      'I build a custom dynamic-pricing strategy around your market, your property, and the booking windows that convert, then refine it continuously.': 'Creo una estrategia de precios dinámicos a medida en torno a su mercado, su propiedad y las ventanas de reserva que convierten, y luego la refino de forma continua.',
      'Market & competitor ADR analysis, refreshed regularly': 'Análisis del mercado y de las tarifas de la competencia, actualizado con frecuencia',
      'Seasonality, events & demand-based rate rules': 'Reglas de tarifa según temporada, eventos y demanda',
      'Gap-filling, last-minute & orphan-night strategy': 'Estrategia de relleno, última hora y noches huérfanas',
      'Minimum-stay tuning to protect profit, not just occupancy': 'Ajuste de estancia mínima para proteger el beneficio, no solo la ocupación',
      'See how it works': 'Ver cómo funciona',
      'revenue': 'ingresos',

      // --- home: process ---
      'How it works': 'Cómo funciona',
      'A clear path from audit to optimized revenue': 'Un camino claro, de la auditoría a los ingresos optimizados',
      'Audit': 'Auditoría',
      'I review your listings, pricing, channels and data to find where revenue is leaking.': 'Reviso sus anuncios, precios, canales y datos para encontrar por dónde se escapan los ingresos.',
      'Strategy': 'Estrategia',
      'A tailored plan for pricing, listing optimization and channel mix, built around your market and goals.': 'Un plan a medida para precios, optimización de anuncios y mezcla de canales, diseñado en torno a su mercado y objetivos.',
      'Implementation': 'Implementación',
      'I set up the tools, rewrite the listings, configure automation and put the strategy live.': 'Configuro las herramientas, reescribo los anuncios, ajusto la automatización y pongo la estrategia en marcha.',
      'Optimization': 'Optimización',
      'Ongoing monitoring and adjustments to keep occupancy, ADR and revenue trending up.': 'Seguimiento y ajustes continuos para que la ocupación, el ADR y los ingresos sigan subiendo.',

      // --- home: testimonials ---
      'What clients say': 'Lo que dicen los clientes',
      'Hosts who stopped leaving money on the table': 'Anfitriones que dejaron de perder dinero sobre la mesa',
      "Roy isn't cheap, and he tells you that up front, but he made it back in the first month. Our revenue is up sharply and I finally understand my own pricing.": 'Roy no es barato, y lo dice de entrada, pero se pagó solo el primer mes. Nuestros ingresos subieron con fuerza y por fin entiendo mis propios precios.',
      'Superhost · Queenstown, NZ': 'Superhost · Queenstown, NZ',
      'We brought Roy in for our 7-listing portfolio. The Hostaway setup and pricing overhaul paid for itself almost immediately. Easily our best consulting spend.': 'Trajimos a Roy para nuestro portafolio de 7 anuncios. La configuración de Hostaway y la renovación de precios se pagaron casi de inmediato. Sin duda, nuestra mejor inversión en consultoría.',
      'Portfolio Host · Bali': 'Anfitrión de portafolio · Bali',
      'Ten years of experience shows. He moved faster than the two consultants we tried before, and the occupancy on our slow season is unrecognizable.': 'Diez años de experiencia se notan. Avanzó más rápido que los dos consultores que probamos antes, y la ocupación de nuestra temporada baja es irreconocible.',
      'Owners · Tuscany, Italy': 'Propietarios · Toscana, Italia'
    }
  };

  /* ----- inject switcher styles ----- */
  var css =
    '.langswitch{display:inline-flex;gap:2px;background:rgba(0,0,0,.05);border-radius:999px;padding:3px;vertical-align:middle}' +
    '.langbtn{border:none;background:none;font:inherit;font-size:12px;font-weight:700;letter-spacing:.02em;color:#6b6157;padding:5px 9px;border-radius:999px;cursor:pointer;line-height:1;transition:background .15s,color .15s}' +
    '.langbtn.active{background:#E63946;color:#fff}' +
    '.langbtn:hover:not(.active){color:#17120f}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ----- collect translatable text nodes ----- */
  var items = [];
  function collect() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var v = n.nodeValue;
        if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CANVAS') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('#langswitch, [data-count], [data-year]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var v = n.nodeValue;
      items.push({
        n: n,
        orig: v,
        lead: (v.match(/^\s*/) || [''])[0],
        trail: (v.match(/\s*$/) || [''])[0],
        key: v.trim().replace(/\s+/g, ' ')
      });
    }
  }

  function apply(lang) {
    var d = lang === 'en' ? null : DICT[lang];
    items.forEach(function (it) {
      if (!d) { it.n.nodeValue = it.orig; return; }
      var t = d[it.key];
      it.n.nodeValue = (t != null) ? (it.lead + t + it.trail) : it.orig;
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll('.langbtn'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function buildSwitcher() {
    var host = document.getElementById('langswitch');
    if (!host) return;
    host.classList.add('langswitch');
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', 'Language');
    host.innerHTML = LANGS.map(function (p) {
      return '<button type="button" class="langbtn" data-lang="' + p[0] + '">' + p[1] + '</button>';
    }).join('');
    host.addEventListener('click', function (e) {
      var b = e.target.closest('.langbtn');
      if (b) apply(b.getAttribute('data-lang'));
    });
  }

  function init() {
    collect();
    buildSwitcher();
    var saved = 'en';
    try { saved = localStorage.getItem(STORE) || 'en'; } catch (e) {}
    apply(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
