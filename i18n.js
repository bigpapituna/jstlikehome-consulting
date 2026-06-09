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
      'Owners · Tuscany, Italy': 'Propriétaires · Toscane, Italie',

      // --- services page ---
      'Services & Pricing': 'Services et tarifs',
      'Everything your listings need': 'Tout ce dont vos annonces ont besoin',
      'to': 'pour',
      'earn more.': 'gagner plus.',
      "I run the full revenue engine for your rentals: pricing, listings, channels and automation. I've done all of it on 72 of my own properties.": 'Je gère tout le moteur de revenus de vos locations : tarification, annonces, canaux et automatisation. J’ai tout réalisé sur 72 de mes propres logements.',
      'View pricing': 'Voir les tarifs',
      'Book a complimentary call': 'Réserver un appel gratuit',
      '01 · DYNAMIC PRICING & REVENUE': '01 · TARIFICATION DYNAMIQUE ET REVENUS',
      'I build and manage a custom dynamic-pricing strategy in PriceLabs, Beyond Pricing or Wheelhouse, with rules tuned to your market, property and booking windows.': 'Je construis et pilote une stratégie de tarification dynamique sur mesure dans PriceLabs, Beyond Pricing ou Wheelhouse, avec des règles ajustées à votre marché, votre logement et vos fenêtres de réservation.',
      'Seasonality, local events & demand-based rate rules': 'Règles de tarif selon la saison, les événements locaux et la demande',
      'Orphan-night, last-minute & gap-filling strategy': 'Stratégie de nuits orphelines, de dernière minute et de remplissage',
      '02 · LISTING OPTIMIZATION': '02 · OPTIMISATION DES ANNONCES',
      'Listings that rank higher and convert better': 'Des annonces mieux classées qui convertissent mieux',
      'Your listing is your storefront. I rewrite and restructure it for both the algorithm and the guest, so more of the people who see it book.': 'Votre annonce est votre vitrine. Je la réécris et la restructure à la fois pour l’algorithme et pour le voyageur, afin que davantage de personnes qui la voient réservent.',
      'SEO-driven titles, descriptions & highlights': 'Titres, descriptions et points forts optimisés pour le référencement',
      'Photo curation & optimal ordering for conversion': 'Sélection des photos et ordre optimal pour la conversion',
      'Amenities, house rules & settings audit': 'Audit des équipements, du règlement intérieur et des réglages',
      'Cross-platform consistency: Airbnb, VRBO, Booking.com, Expedia': 'Cohérence multiplateforme : Airbnb, VRBO, Booking.com, Expedia',
      '5-star ready': 'Prêt pour les 5 étoiles',
      '03 · CHANNEL & OTA EXPANSION': '03 · EXPANSION DES CANAUX ET OTA',
      'More channels, more bookings, zero double-bookings': 'Plus de canaux, plus de réservations, zéro double réservation',
      'As a Booking.com Preferred Partner and power user of the major OTAs, I get you in front of more guests, without double bookings or operational headaches.': 'En tant que partenaire privilégié de Booking.com et utilisateur expert des principales OTA, je vous mets devant plus de voyageurs, sans doubles réservations ni casse-têtes opérationnels.',
      'Multi-OTA setup & optimization': 'Configuration et optimisation multi-OTA',
      'Calendar & rate sync via channel manager': 'Synchronisation du calendrier et des tarifs via le gestionnaire de canaux',
      'Preferred-partner positioning & visibility boosts': 'Positionnement de partenaire privilégié et gains de visibilité',
      'Direct-booking groundwork where it makes sense': 'Bases de la réservation directe là où c’est pertinent',
      '04 · HOSTAWAY SETUP & AUTOMATION': '04 · CONFIGURATION HOSTAWAY ET AUTOMATISATION',
      'An operation that runs itself': 'Une exploitation qui tourne toute seule',
      'I set up Hostaway end to end and document each step, so your listings, messaging and team workflows stay automated and ready to scale.': 'Je configure Hostaway de bout en bout et documente chaque étape, pour que vos annonces, votre messagerie et les processus de votre équipe restent automatisés et prêts à grandir.',
      'Full Hostaway build & channel-manager configuration': 'Construction complète de Hostaway et configuration du gestionnaire de canaux',
      'Automated guest messaging & review flows': 'Messagerie automatisée aux voyageurs et flux d’avis',
      'Step-by-step SOPs & training documentation': 'Procédures pas à pas et documentation de formation',
      'Team onboarding so new listings launch fast': 'Intégration de l’équipe pour lancer vite les nouvelles annonces',
      'Hostaway certified workflow': 'Processus certifié Hostaway',
      "05 · OCCUPANCY & BOOKING-GAP STRATEGY": '05 · STRATÉGIE D’OCCUPATION ET DE CRÉNEAUX VIDES',
      'Fill the calendar without giving away margin': 'Remplir le calendrier sans sacrifier la marge',
      "An empty night is revenue you can't recover. I find the recurring soft spots in your calendar and fill them while protecting your margin.": 'Une nuit vide est un revenu que vous ne récupérerez jamais. Je repère les points faibles récurrents de votre calendrier et les comble tout en protégeant votre marge.',
      'Historical gap & low-occupancy analysis': 'Analyse des trous passés et des faibles taux d’occupation',
      'Targeted promotions & length-of-stay discounts': 'Promotions ciblées et remises selon la durée du séjour',
      'Last-minute & early-bird pricing logic': 'Logique de tarifs de dernière minute et anticipés',
      'Profit-first guardrails on every discount': 'Garde-fous axés sur la rentabilité pour chaque remise',
      'occupancy': 'occupation',
      '06 · AUDITS, COACHING & TRAINING': '06 · AUDITS, COACHING ET FORMATION',
      'Know what to fix, and how': 'Savoir quoi corriger, et comment',
      "Prefer to keep things in-house? I'll audit your entire operation, hand you a prioritized growth roadmap, and coach your team to execute it with confidence.": 'Vous préférez garder la main en interne ? J’audite toute votre exploitation, je vous remets une feuille de route de croissance priorisée et je forme votre équipe à l’exécuter en confiance.',
      'Full account & portfolio audit with scorecard': 'Audit complet du compte et du portefeuille avec tableau de notation',
      'Prioritized, revenue-ranked action plan': 'Plan d’action priorisé et classé par revenus',
      '1-on-1 coaching & team training sessions': 'Séances de coaching individuel et de formation d’équipe',
      'Documentation you keep and reuse': 'Une documentation que vous conservez et réutilisez',
      'Engagements': 'Formules',
      'Premium service, priced for the return you get': 'Un service premium, au prix du retour qu’il génère',
      'My rates run higher than most consultants. Deep experience means faster results and a higher ROI, so you earn it back. Choose the engagement that fits where you are.': 'Mes tarifs sont plus élevés que ceux de la plupart des consultants. Une grande expérience signifie des résultats plus rapides et un meilleur retour sur investissement, que vous récupérez. Choisissez la formule qui correspond à votre situation.',
      'Initial Audit': 'Audit initial',
      'For hosts who want quick, expert wins to start.': 'Pour les hôtes qui veulent des gains rapides et experts pour démarrer.',
      'One-time fee · delivered in ~1 week': 'Forfait unique · livré en ~1 semaine',
      'Full listing & pricing audit': 'Audit complet de l’annonce et de la tarification',
      'Prioritized action plan': 'Plan d’action priorisé',
      'Title & description review': 'Révision du titre et de la description',
      'Pricing-tool health check': 'Bilan de santé de l’outil de tarification',
      '30-min strategy call': 'Appel stratégique de 30 min',
      'Most popular': 'Le plus populaire',
      'Full Optimization': 'Optimisation complète',
      'Done-for-you across pricing, listing & channels.': 'Clé en main sur la tarification, l’annonce et les canaux.',
      'Per listing · one-time project · ROI in 30–90 days': 'Par annonce · projet ponctuel · ROI en 30–90 jours',
      'Everything in the Initial Audit': 'Tout l’Audit initial',
      'Dynamic pricing built & managed': 'Tarification dynamique mise en place et pilotée',
      'Full listing & photo optimization': 'Optimisation complète de l’annonce et des photos',
      'Multi-OTA / channel setup': 'Configuration multi-OTA / canaux',
      'Occupancy & booking-gap strategy': 'Stratégie d’occupation et de créneaux vides',
      '30 days of post-launch tuning': '30 jours d’ajustements après lancement',
      'Portfolio Partner': 'Partenaire de portefeuille',
      'Ongoing management for 5+ listings & teams.': 'Gestion continue pour 5+ annonces et équipes.',
      'Custom': 'Sur mesure',
      'Monthly retainer · tailored to your portfolio': 'Forfait mensuel · adapté à votre portefeuille',
      'Everything in Full Optimization': 'Toute l’Optimisation complète',
      'Hostaway setup & automation': 'Configuration et automatisation Hostaway',
      'Ongoing revenue management': 'Gestion continue des revenus',
      'Team training & documentation': 'Formation d’équipe et documentation',
      'Priority support & reporting': 'Support prioritaire et reporting',
      'Request a quote': 'Demander un devis',
      'All prices in USD. Starting points that vary by market & property count. Each engagement begins with a complimentary strategy call.': 'Tous les prix sont en USD. Ce sont des points de départ qui varient selon le marché et le nombre de logements. Chaque mission commence par un appel stratégique gratuit.',
      'Good to know': 'Bon à savoir',
      'Frequently asked questions': 'Questions fréquentes',
      'Why are you more expensive than other consultants?': 'Pourquoi êtes-vous plus cher que les autres consultants ?',
      'Because 12+ years of hands-on experience means I diagnose faster, fix smarter and deliver results in less time than most. You pay a premium and make it back many times over.': 'Parce que 12+ ans d’expérience de terrain me permettent de diagnostiquer plus vite, de corriger plus intelligemment et d’obtenir des résultats en moins de temps que la plupart. Vous payez un premium et le récupérez largement.',
      'Which tools and platforms do you work with?': 'Avec quels outils et plateformes travaillez-vous ?',
      'Airbnb (Superhost), Booking.com (Preferred Partner), VRBO and Expedia on the OTA side; PriceLabs (Expert), Beyond Pricing and Wheelhouse for pricing; and Hostaway (Premium Partner) for channel management and automation, plus most other major tools.': 'Airbnb (Superhost), Booking.com (Partenaire privilégié), VRBO et Expedia côté OTA ; PriceLabs (Expert), Beyond Pricing et Wheelhouse pour la tarification ; et Hostaway (Partenaire Premium) pour la gestion des canaux et l’automatisation, ainsi que la plupart des autres grands outils.',
      'Do you work with single listings or only portfolios?': 'Travaillez-vous avec des annonces uniques ou seulement des portefeuilles ?',
      'Both. The Initial Audit is perfect for a single property, while Full Optimization and Portfolio Partner scale to multi-listing operations and management teams.': 'Les deux. L’Audit initial est parfait pour un seul logement, tandis qu’Optimisation complète et Partenaire de portefeuille s’adaptent aux opérations multi-annonces et aux équipes de gestion.',
      'How quickly will I see results?': 'En combien de temps verrai-je des résultats ?',
      'Pricing and listing changes can lift revenue within days. Most clients see a revenue and occupancy lift within the first 30–90 days, depending on market and season.': 'Les changements de tarification et d’annonce peuvent augmenter les revenus en quelques jours. La plupart des clients constatent une hausse des revenus et de l’occupation dans les 30 à 90 premiers jours, selon le marché et la saison.',
      'Where are your clients based?': 'Où se trouvent vos clients ?',
      'All over the world. I work daily with hosts across Canada, the USA, New Zealand, Bali and Europe. Vacation rental fundamentals translate across markets, and I adapt strategy to each one.': 'Partout dans le monde. Je travaille chaque jour avec des hôtes au Canada, aux États-Unis, en Nouvelle-Zélande, à Bali et en Europe. Les fondamentaux de la location de vacances se transposent d’un marché à l’autre, et j’adapte la stratégie à chacun.',
      'Not sure which engagement fits?': 'Vous ne savez pas quelle formule choisir ?',
      "Book a complimentary strategy call and I'll tell you straight where the biggest, fastest wins are for your listings.": 'Réservez un appel stratégique gratuit et je vous dirai sans détour où se trouvent les gains les plus importants et les plus rapides pour vos annonces.',

      // --- about page ---
      'About Roy': 'À propos de Roy',
      "Hi, I'm Roy. I've spent over a decade making rentals": 'Bonjour, je suis Roy. Depuis plus de dix ans, j’aide les locations à',
      "I'm a vacation rental consultant based in Ottawa, Canada. I started as an owner-operator, building and managing": 'Je suis consultant en location de vacances basé à Ottawa, au Canada. J’ai débuté comme propriétaire-exploitant, en créant et en gérant',
      ', before becoming the person other hosts call when they want serious results.': ', avant de devenir la personne que les autres hôtes appellent quand ils veulent de vrais résultats.',
      'As a Booking.com Preferred Partner, Airbnb Superhost, Hostaway Premium Partner and PriceLabs expert, and a daily user of VRBO, Expedia, Beyond Pricing and Wheelhouse, I bring insider access and tested, real-world strategy to every engagement. My clients span Canada, the USA, New Zealand, Bali and Europe, and the goal stays the same: a higher return on your investment.': 'En tant que partenaire privilégié de Booking.com, Superhost Airbnb, partenaire Premium Hostaway et expert PriceLabs, et utilisateur quotidien de VRBO, Expedia, Beyond Pricing et Wheelhouse, j’apporte un accès privilégié et une stratégie éprouvée et concrète à chaque mission. Mes clients sont au Canada, aux États-Unis, en Nouvelle-Zélande, à Bali et en Europe, et l’objectif reste le même : un meilleur retour sur votre investissement.',
      '12+ Years': '12+ ans',
      'Automation': 'Automatisation',
      'Revenue Growth': 'Croissance des revenus',
      'MY APPROACH': 'MON APPROCHE',
      "I've done this, not just advised on it": 'Je l’ai fait, pas seulement conseillé',
      "Anyone can read a pricing dashboard. I've run 72 of my own listings through real seasons, market swings and tough guests, so I know what moves revenue and what only looks good in a report.": 'N’importe qui peut lire un tableau de bord de tarification. J’ai géré 72 de mes propres annonces à travers de vraies saisons, des variations de marché et des voyageurs difficiles, donc je sais ce qui fait bouger les revenus et ce qui ne fait que bien paraître dans un rapport.',
      'ROI-obsessed.': 'Obsédé par le ROI.',
      'I optimize for profit, not vanity occupancy': 'J’optimise pour le profit, pas pour une occupation de façade',
      'Premium & efficient.': 'Premium et efficace.',
      'Experience means faster, sharper results': 'L’expérience, ce sont des résultats plus rapides et plus précis',
      'Insider access.': 'Accès privilégié.',
      'Preferred-partner status & the major tools': 'Statut de partenaire privilégié et les principaux outils',
      'Global perspective.': 'Perspective mondiale.',
      'Daily work across five continents': 'Un travail quotidien sur cinq continents',
      'Owner-operator, not just an advisor': 'Propriétaire-exploitant, pas seulement un conseiller',
      'Get in touch': 'Prendre contact',
      "Let's talk about your portfolio": 'Parlons de votre portefeuille',
      "Tell me about your properties and what you want to improve, and I'll reply within one business day.": 'Parlez-moi de vos logements et de ce que vous souhaitez améliorer, et je vous réponds sous un jour ouvré.',
      'Email': 'E-mail',
      'Response time': 'Délai de réponse',
      'Within 1 business day': 'Sous 1 jour ouvré',
      'Based in': 'Basé à',
      'Ottawa, Canada · serving worldwide': 'Ottawa, Canada · au service du monde entier',
      'Name': 'Nom',
      'Number of properties': 'Nombre de logements',
      'Website URL (optional)': 'URL du site web (facultatif)',
      'How can I help?': 'Comment puis-je vous aider ?',
      'Send message': 'Envoyer le message'
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
      'Owners · Tuscany, Italy': 'Propietarios · Toscana, Italia',

      // --- services page ---
      'Services & Pricing': 'Servicios y precios',
      'Everything your listings need': 'Todo lo que sus anuncios necesitan',
      'to': 'para',
      'earn more.': 'ganar más.',
      "I run the full revenue engine for your rentals: pricing, listings, channels and automation. I've done all of it on 72 of my own properties.": 'Gestiono todo el motor de ingresos de sus alquileres: precios, anuncios, canales y automatización. Lo he hecho todo en 72 propiedades propias.',
      'View pricing': 'Ver precios',
      'Book a complimentary call': 'Reservar una llamada gratis',
      '01 · DYNAMIC PRICING & REVENUE': '01 · PRECIOS DINÁMICOS E INGRESOS',
      'I build and manage a custom dynamic-pricing strategy in PriceLabs, Beyond Pricing or Wheelhouse, with rules tuned to your market, property and booking windows.': 'Creo y gestiono una estrategia de precios dinámicos a medida en PriceLabs, Beyond Pricing o Wheelhouse, con reglas ajustadas a su mercado, su propiedad y sus ventanas de reserva.',
      'Seasonality, local events & demand-based rate rules': 'Reglas de tarifa según temporada, eventos locales y demanda',
      'Orphan-night, last-minute & gap-filling strategy': 'Estrategia de noches huérfanas, última hora y relleno',
      '02 · LISTING OPTIMIZATION': '02 · OPTIMIZACIÓN DE ANUNCIOS',
      'Listings that rank higher and convert better': 'Anuncios mejor posicionados que convierten mejor',
      'Your listing is your storefront. I rewrite and restructure it for both the algorithm and the guest, so more of the people who see it book.': 'Su anuncio es su escaparate. Lo reescribo y reestructuro tanto para el algoritmo como para el huésped, de modo que más personas que lo ven reserven.',
      'SEO-driven titles, descriptions & highlights': 'Títulos, descripciones y aspectos destacados optimizados para SEO',
      'Photo curation & optimal ordering for conversion': 'Selección de fotos y orden óptimo para la conversión',
      'Amenities, house rules & settings audit': 'Auditoría de servicios, normas de la casa y ajustes',
      'Cross-platform consistency: Airbnb, VRBO, Booking.com, Expedia': 'Coherencia entre plataformas: Airbnb, VRBO, Booking.com, Expedia',
      '5-star ready': 'Listo para 5 estrellas',
      '03 · CHANNEL & OTA EXPANSION': '03 · EXPANSIÓN DE CANALES Y OTA',
      'More channels, more bookings, zero double-bookings': 'Más canales, más reservas, cero reservas dobles',
      'As a Booking.com Preferred Partner and power user of the major OTAs, I get you in front of more guests, without double bookings or operational headaches.': 'Como Socio preferente de Booking.com y usuario experto de las principales OTA, lo pongo ante más huéspedes, sin reservas dobles ni dolores de cabeza operativos.',
      'Multi-OTA setup & optimization': 'Configuración y optimización multi-OTA',
      'Calendar & rate sync via channel manager': 'Sincronización de calendario y tarifas con el gestor de canales',
      'Preferred-partner positioning & visibility boosts': 'Posicionamiento de socio preferente y mejoras de visibilidad',
      'Direct-booking groundwork where it makes sense': 'Bases para la reserva directa donde tenga sentido',
      '04 · HOSTAWAY SETUP & AUTOMATION': '04 · CONFIGURACIÓN DE HOSTAWAY Y AUTOMATIZACIÓN',
      'An operation that runs itself': 'Una operación que se gestiona sola',
      'I set up Hostaway end to end and document each step, so your listings, messaging and team workflows stay automated and ready to scale.': 'Configuro Hostaway de principio a fin y documento cada paso, para que sus anuncios, mensajería y flujos de trabajo del equipo sigan automatizados y listos para crecer.',
      'Full Hostaway build & channel-manager configuration': 'Montaje completo de Hostaway y configuración del gestor de canales',
      'Automated guest messaging & review flows': 'Mensajería automatizada a huéspedes y flujos de reseñas',
      'Step-by-step SOPs & training documentation': 'Procedimientos paso a paso y documentación de formación',
      'Team onboarding so new listings launch fast': 'Incorporación del equipo para lanzar rápido los nuevos anuncios',
      'Hostaway certified workflow': 'Flujo de trabajo certificado de Hostaway',
      "05 · OCCUPANCY & BOOKING-GAP STRATEGY": '05 · ESTRATEGIA DE OCUPACIÓN Y HUECOS',
      'Fill the calendar without giving away margin': 'Llenar el calendario sin sacrificar el margen',
      "An empty night is revenue you can't recover. I find the recurring soft spots in your calendar and fill them while protecting your margin.": 'Una noche vacía es un ingreso que no podrá recuperar. Localizo los puntos débiles recurrentes de su calendario y los relleno protegiendo su margen.',
      'Historical gap & low-occupancy analysis': 'Análisis de huecos históricos y baja ocupación',
      'Targeted promotions & length-of-stay discounts': 'Promociones dirigidas y descuentos por duración de la estancia',
      'Last-minute & early-bird pricing logic': 'Lógica de precios de última hora y anticipados',
      'Profit-first guardrails on every discount': 'Salvaguardas centradas en el beneficio en cada descuento',
      'occupancy': 'ocupación',
      '06 · AUDITS, COACHING & TRAINING': '06 · AUDITORÍAS, COACHING Y FORMACIÓN',
      'Know what to fix, and how': 'Saber qué arreglar, y cómo',
      "Prefer to keep things in-house? I'll audit your entire operation, hand you a prioritized growth roadmap, and coach your team to execute it with confidence.": '¿Prefiere llevarlo internamente? Audito toda su operación, le entrego una hoja de ruta de crecimiento priorizada y formo a su equipo para ejecutarla con confianza.',
      'Full account & portfolio audit with scorecard': 'Auditoría completa de la cuenta y el portafolio con cuadro de mando',
      'Prioritized, revenue-ranked action plan': 'Plan de acción priorizado y ordenado por ingresos',
      '1-on-1 coaching & team training sessions': 'Sesiones de coaching individual y formación de equipo',
      'Documentation you keep and reuse': 'Documentación que conserva y reutiliza',
      'Engagements': 'Modalidades',
      'Premium service, priced for the return you get': 'Servicio premium, con un precio acorde al retorno que obtiene',
      'My rates run higher than most consultants. Deep experience means faster results and a higher ROI, so you earn it back. Choose the engagement that fits where you are.': 'Mis tarifas son más altas que las de la mayoría de los consultores. Una amplia experiencia significa resultados más rápidos y un mayor retorno, que usted recupera. Elija la modalidad que se ajuste a su situación.',
      'Initial Audit': 'Auditoría inicial',
      'For hosts who want quick, expert wins to start.': 'Para anfitriones que quieren logros rápidos y expertos para empezar.',
      'One-time fee · delivered in ~1 week': 'Pago único · entregado en ~1 semana',
      'Full listing & pricing audit': 'Auditoría completa del anuncio y los precios',
      'Prioritized action plan': 'Plan de acción priorizado',
      'Title & description review': 'Revisión del título y la descripción',
      'Pricing-tool health check': 'Chequeo de la herramienta de precios',
      '30-min strategy call': 'Llamada estratégica de 30 min',
      'Most popular': 'El más popular',
      'Full Optimization': 'Optimización completa',
      'Done-for-you across pricing, listing & channels.': 'Hecho por mí en precios, anuncio y canales.',
      'Per listing · one-time project · ROI in 30–90 days': 'Por anuncio · proyecto único · ROI en 30–90 días',
      'Everything in the Initial Audit': 'Todo lo de la Auditoría inicial',
      'Dynamic pricing built & managed': 'Precios dinámicos montados y gestionados',
      'Full listing & photo optimization': 'Optimización completa del anuncio y las fotos',
      'Multi-OTA / channel setup': 'Configuración multi-OTA / canales',
      'Occupancy & booking-gap strategy': 'Estrategia de ocupación y huecos',
      '30 days of post-launch tuning': '30 días de ajustes tras el lanzamiento',
      'Portfolio Partner': 'Socio de portafolio',
      'Ongoing management for 5+ listings & teams.': 'Gestión continua para 5+ anuncios y equipos.',
      'Custom': 'A medida',
      'Monthly retainer · tailored to your portfolio': 'Cuota mensual · adaptada a su portafolio',
      'Everything in Full Optimization': 'Todo lo de Optimización completa',
      'Hostaway setup & automation': 'Configuración y automatización de Hostaway',
      'Ongoing revenue management': 'Gestión continua de ingresos',
      'Team training & documentation': 'Formación del equipo y documentación',
      'Priority support & reporting': 'Soporte prioritario e informes',
      'Request a quote': 'Solicitar presupuesto',
      'All prices in USD. Starting points that vary by market & property count. Each engagement begins with a complimentary strategy call.': 'Todos los precios en USD. Son puntos de partida que varían según el mercado y el número de propiedades. Cada colaboración empieza con una llamada estratégica gratuita.',
      'Good to know': 'Conviene saber',
      'Frequently asked questions': 'Preguntas frecuentes',
      'Why are you more expensive than other consultants?': '¿Por qué es más caro que otros consultores?',
      'Because 12+ years of hands-on experience means I diagnose faster, fix smarter and deliver results in less time than most. You pay a premium and make it back many times over.': 'Porque 12+ años de experiencia práctica me permiten diagnosticar más rápido, corregir con más criterio y obtener resultados en menos tiempo que la mayoría. Paga un premium y lo recupera con creces.',
      'Which tools and platforms do you work with?': '¿Con qué herramientas y plataformas trabaja?',
      'Airbnb (Superhost), Booking.com (Preferred Partner), VRBO and Expedia on the OTA side; PriceLabs (Expert), Beyond Pricing and Wheelhouse for pricing; and Hostaway (Premium Partner) for channel management and automation, plus most other major tools.': 'Airbnb (Superhost), Booking.com (Socio preferente), VRBO y Expedia en el lado OTA; PriceLabs (Experto), Beyond Pricing y Wheelhouse para precios; y Hostaway (Socio Premium) para la gestión de canales y la automatización, además de la mayoría de las grandes herramientas.',
      'Do you work with single listings or only portfolios?': '¿Trabaja con anuncios individuales o solo con portafolios?',
      'Both. The Initial Audit is perfect for a single property, while Full Optimization and Portfolio Partner scale to multi-listing operations and management teams.': 'Ambos. La Auditoría inicial es perfecta para una sola propiedad, mientras que Optimización completa y Socio de portafolio escalan a operaciones de varios anuncios y equipos de gestión.',
      'How quickly will I see results?': '¿En cuánto tiempo veré resultados?',
      'Pricing and listing changes can lift revenue within days. Most clients see a revenue and occupancy lift within the first 30–90 days, depending on market and season.': 'Los cambios de precios y de anuncio pueden subir los ingresos en días. La mayoría de los clientes ven un aumento de ingresos y ocupación en los primeros 30–90 días, según el mercado y la temporada.',
      'Where are your clients based?': '¿Dónde están sus clientes?',
      'All over the world. I work daily with hosts across Canada, the USA, New Zealand, Bali and Europe. Vacation rental fundamentals translate across markets, and I adapt strategy to each one.': 'En todo el mundo. Trabajo a diario con anfitriones en Canadá, EE. UU., Nueva Zelanda, Bali y Europa. Los fundamentos del alquiler vacacional se trasladan entre mercados, y adapto la estrategia a cada uno.',
      'Not sure which engagement fits?': '¿No sabe qué modalidad le conviene?',
      "Book a complimentary strategy call and I'll tell you straight where the biggest, fastest wins are for your listings.": 'Reserve una llamada estratégica gratuita y le diré sin rodeos dónde están las mayores y más rápidas ganancias para sus anuncios.',

      // --- about page ---
      'About Roy': 'Sobre Roy',
      "Hi, I'm Roy. I've spent over a decade making rentals": 'Hola, soy Roy. Llevo más de una década ayudando a los alquileres a',
      "I'm a vacation rental consultant based in Ottawa, Canada. I started as an owner-operator, building and managing": 'Soy consultor de alquiler vacacional con sede en Ottawa, Canadá. Empecé como propietario-operador, creando y gestionando',
      ', before becoming the person other hosts call when they want serious results.': ', antes de convertirme en la persona a la que otros anfitriones llaman cuando quieren resultados serios.',
      'As a Booking.com Preferred Partner, Airbnb Superhost, Hostaway Premium Partner and PriceLabs expert, and a daily user of VRBO, Expedia, Beyond Pricing and Wheelhouse, I bring insider access and tested, real-world strategy to every engagement. My clients span Canada, the USA, New Zealand, Bali and Europe, and the goal stays the same: a higher return on your investment.': 'Como Socio preferente de Booking.com, Superhost de Airbnb, Socio Premium de Hostaway y experto en PriceLabs, y usuario diario de VRBO, Expedia, Beyond Pricing y Wheelhouse, aporto acceso privilegiado y una estrategia probada y real a cada colaboración. Mis clientes están en Canadá, EE. UU., Nueva Zelanda, Bali y Europa, y el objetivo sigue siendo el mismo: un mayor retorno de su inversión.',
      '12+ Years': '12+ años',
      'Automation': 'Automatización',
      'Revenue Growth': 'Crecimiento de ingresos',
      'MY APPROACH': 'MI ENFOQUE',
      "I've done this, not just advised on it": 'Lo he hecho, no solo lo he aconsejado',
      "Anyone can read a pricing dashboard. I've run 72 of my own listings through real seasons, market swings and tough guests, so I know what moves revenue and what only looks good in a report.": 'Cualquiera puede leer un panel de precios. He gestionado 72 de mis propios anuncios a través de temporadas reales, vaivenes del mercado y huéspedes difíciles, así que sé qué mueve los ingresos y qué solo se ve bien en un informe.',
      'ROI-obsessed.': 'Obsesionado con el ROI.',
      'I optimize for profit, not vanity occupancy': 'Optimizo para el beneficio, no para una ocupación de vanidad',
      'Premium & efficient.': 'Premium y eficiente.',
      'Experience means faster, sharper results': 'La experiencia significa resultados más rápidos y precisos',
      'Insider access.': 'Acceso privilegiado.',
      'Preferred-partner status & the major tools': 'Estatus de socio preferente y las principales herramientas',
      'Global perspective.': 'Perspectiva global.',
      'Daily work across five continents': 'Trabajo diario en cinco continentes',
      'Owner-operator, not just an advisor': 'Propietario-operador, no solo un asesor',
      'Get in touch': 'Póngase en contacto',
      "Let's talk about your portfolio": 'Hablemos de su portafolio',
      "Tell me about your properties and what you want to improve, and I'll reply within one business day.": 'Cuénteme sobre sus propiedades y lo que quiere mejorar, y le responderé en un día hábil.',
      'Email': 'Correo electrónico',
      'Response time': 'Tiempo de respuesta',
      'Within 1 business day': 'En 1 día hábil',
      'Based in': 'Con sede en',
      'Ottawa, Canada · serving worldwide': 'Ottawa, Canadá · al servicio de todo el mundo',
      'Name': 'Nombre',
      'Number of properties': 'Número de propiedades',
      'Website URL (optional)': 'URL del sitio web (opcional)',
      'How can I help?': '¿Cómo puedo ayudarle?',
      'Send message': 'Enviar mensaje'
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
