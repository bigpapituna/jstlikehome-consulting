# JSTLIKEHOME — STR Consulting (3-page site)

A premium, fully static **3-page** marketing site for Roy Younes' short-term-rental
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
│   ├── logo.svg      ← standalone heart-house mark
│   └── img/          ← 9 stock photos (see "Replace the imagery" below)
└── README.md
```

---

## ✅ Before you go live — replace these placeholders

**1. Email** — currently `hello@jstlikehome.com`. Change it in **four** places:
`index.html`, `services.html`, `about.html` (the `mailto:` link) and `script.js`
(the `CONTACT_EMAIL` constant).

**2. Upwork profile link** — currently points to `https://www.upwork.com`. Replace with
your real profile URL (appears in each page's footer and on the About contact card).

**3. Representative numbers** — these are placeholders I added so the site feels complete.
Confirm or change them to your real figures:
- Stat strip: **500+ listings optimized** (10+, 28 and 5 are your real numbers)
- Hero pills: **$2.4M+ revenue managed**, **+34% avg revenue**
- Results bento: **+41% ADR**, **+34% revenue**, **92% occupancy**

**4. Testimonials** — `Sophie L.`, `Marcus T.`, `David & Mara` are **sample quotes**.
Swap in real client testimonials (in `index.html` and `about.html`) before publishing.

**5. Pricing** — `$490`, `$1,500 from`, and `Custom` in `services.html` are starting
suggestions. Set your real numbers (or keep "Custom" / "Request a quote").

**6. Imagery** — see below.

**7. (Optional) Booking link** — the "Book a call" buttons point to the contact form
(`about.html#contact`). If you use Calendly/Cal.com, replace those `href`s with your link.

---

## 🖼️ Replace the imagery
`assets/img/` contains licensed-free **Unsplash stock** chosen to match the look. Swap any
file for your own photo of the **same name** and it just works. Most important:
- **`host-man.jpg`** — used as Roy's headshot on the About page. Replace with a real photo
  of you (keep the name, or update the `src` in `about.html`).
- The interior/property shots (`dining`, `bedroom`, `exterior`, `coastal`, `kitchen`,
  `balcony`, `workspace`) — swap for real photos of listings you've optimized when you have them.

> The logo is an inline SVG (the coral heart + house mark), so it's crisp at any size and
> needs no image file. To use your official PNG instead, replace the `<svg>…</svg>` blocks.

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
Open `index.html` directly, or serve the folder with any static server, e.g. the included
PowerShell helper used during development, or VS Code's "Live Server" extension.

## ✉️ Optional: a hosted contact form
The form opens the visitor's email app (works everywhere, no setup). To collect submissions
to your inbox instead, point the `<form>` at a free service like
[Formspree](https://formspree.io): set `action="https://formspree.io/f/XXXX" method="POST"`
and remove the submit handler in `script.js`.
