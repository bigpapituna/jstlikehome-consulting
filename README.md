# JSTLIKEHOME — Vacation Rental Consulting (3-page site)

A premium, fully static **3-page** marketing site for Roy Younes' vacation rental
consulting services. No framework, no build step — just HTML, CSS and a little
JavaScript, so it deploys instantly on Vercel.

Design system is based on the **ui-ux-pro-max "Trust & Authority + Premium Sans"**
recommendation: warm-neutral palette punched with the JSTLIKEHOME coral (`#E63946`),
**Bricolage Grotesque** (display) + **DM Sans** (body), rounded bento layouts, floating
result pills, and refined scroll motion.

```
jstlikehome-consulting/
├── index.html       ← Home (hero, results bento, services, process, testimonials)
├── services.html    ← Services & Pricing (feature rows, pricing tiers, FAQ)
├── about.html       ← About Roy + Contact (story, credibility, contact form)
├── styles.css       ← all styling (brand tokens at the top in :root)
├── script.js        ← nav, scroll reveal, counters, FAQ, contact form
├── assets/
│   ├── logo.svg      ← standalone heart-house mark (SVG)
│   └── img/          ← logo files + stock photos
└── README.md
```

Contact email is **roy.y@jstlikehome.com** (set in the 3 HTML files + `script.js`).
The contact form opens the visitor's email app — clients book direct (no Upwork/phone).

---

## ⚠️ Still worth reviewing before / after launch

**1. Representative numbers** — these are placeholders so the site feels complete.
Confirm or change to your real figures:
- Stat strips: **500+ listings optimized** (10+, 5, and 72 are real)
- Hero pills: **$10M+ revenue managed**, **+34% avg revenue**
- Results bento: **+41% ADR**, **+34% revenue**, **92% occupancy**

**2. Property count is intentionally different on two pages** — Home & About show
**72** ("personally built & managed"); the Services stat strip shows **100+**. If you'd
like them to match, change the `data-count` value in the relevant stat (`index.html`,
`about.html` = 72; `services.html` = 100).

**3. Testimonials** — `Sophie L.`, `Marcus T.`, `David & Mara` are **sample quotes**.
Swap in real client testimonials (in `index.html` and `about.html`).

**4. Pricing** — Initial Audit is **$450–900**; Full Optimization **$1,500 from / listing**;
Portfolio Partner **Custom**. Adjust the latter two if needed (`services.html`).

**5. (Optional) Booking link** — "Book a call" buttons point to the contact form
(`about.html#contact`). If you use Calendly/Cal.com, replace those `href`s with your link.

---

## 🖼️ Imagery & logo
- **Logo:** your real logo is used in the header (cropped icon, `assets/img/logo-mark.jpg`)
  and on the About page (full logo, `assets/img/logo-full.jpg`). Both come from your
  `Photo from Roy.jpg`. The favicon is an inline SVG of the same mark.
- **Stock photos** in `assets/img/` (Unsplash) fill the interiors/results sections. Swap any
  file for your own photo of the **same name** and it just works — ideal once you have real
  shots of listings you've optimized.

---

## 🚀 Deploy to Vercel via GitHub

```bash
cd "jstlikehome-consulting"
git add .
git commit -m "Update site"
git remote add origin https://github.com/<your-username>/jstlikehome-consulting.git
git push -u origin main
```

Then in Vercel: **Add New → Project → import the repo → Deploy** (Framework preset
**Other**, no build command, output dir `./`). Add your domain under **Settings → Domains**
(`jstlikehome.com` + `www.jstlikehome.com`) and point DNS as Vercel instructs. Every future
`git push` to `main` redeploys automatically.

---

## 🖥️ Preview locally
Open `index.html` directly, or serve the folder with any static server (e.g. VS Code's
"Live Server" extension).

## ✉️ Optional: a hosted contact form
The form opens the visitor's email app (works everywhere, no setup). To collect submissions
to your inbox instead, point the `<form>` at a free service like
[Formspree](https://formspree.io): set `action="https://formspree.io/f/XXXX" method="POST"`
and remove the submit handler in `script.js`.
