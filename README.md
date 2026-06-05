# JSTLIKEHOME — STR Consulting (one-page site)

A fast, fully static one-page website for Roy Younes' short-term-rental consulting
services. No build step, no framework — just HTML, CSS and a little JavaScript, so it
deploys instantly on Vercel.

```
jstlikehome-consulting/
├── index.html      ← all page content
├── styles.css      ← all styling (brand colors at the top in :root)
├── script.js       ← mobile nav, scroll animations, contact form
├── assets/
│   └── logo.svg     ← standalone logo file (optional)
└── README.md
```

---

## ✅ Before you go live — 3 things to personalize

1. **Email address.** I used `hello@jstlikehome.com` as a placeholder. Change it in **two** places:
   - `index.html` → the contact section (`mailto:hello@jstlikehome.com`)
   - `script.js`  → the line `var CONTACT_EMAIL = 'hello@jstlikehome.com';`
2. **Upwork profile link.** In `index.html`, find `https://www.upwork.com` (the
   "View my Upwork profile" link) and replace it with your real Upwork profile URL.
3. **(Optional) Your headshot.** In the **About** section of `index.html` there's a
   comment showing where to swap the placeholder for a real photo:
   `<img src="assets/roy.jpg" alt="Roy Younes">` — just drop a `roy.jpg` into `assets/`.

> The brand logo is drawn as an inline SVG (the heart + house mark in coral `#E63946`),
> so it's crisp at any size and needs no image file. If you'd rather use your official
> PNG, replace the `<svg>…</svg>` blocks, or set the favicon/og-image to your file.

---

## 🚀 Deploy to Vercel via GitHub

### 1. Put this folder on GitHub
From inside `jstlikehome-consulting/`:

```bash
git init
git add .
git commit -m "Initial JSTLIKEHOME consulting site"
git branch -M main
git remote add origin https://github.com/<your-username>/jstlikehome-consulting.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to **vercel.com → Add New → Project**.
2. Select your `jstlikehome-consulting` repo.
3. **Framework Preset:** `Other` · **Build Command:** *(leave empty)* · **Output Directory:** `./`
   (Vercel auto-detects a static site — defaults are fine.)
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in seconds.

### 3. Point www.jstlikehome.com at it
1. In the Vercel project → **Settings → Domains** → add `jstlikehome.com` and
   `www.jstlikehome.com`.
2. Vercel shows you the DNS records to add at your domain registrar (an `A` record
   and/or a `CNAME` to `cname.vercel-dns.com`).
3. Once DNS propagates, your site is live on your domain with automatic HTTPS.

Every future `git push` to `main` redeploys automatically.

---

## 🖥️ Preview locally
Just double-click `index.html`, or run a tiny static server:

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080
```

---

## ✉️ Optional: a "real" contact form (no email-client popup)
The form currently opens the visitor's email app (works everywhere, zero setup).
To collect submissions to your inbox without that popup, use a free service like
[Formspree](https://formspree.io):

1. Create a form there and copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, change the `<form>` tag to:
   `<form class="contact-form" action="https://formspree.io/f/abcdwxyz" method="POST">`
3. In `script.js`, remove (or comment out) the `form.addEventListener('submit', …)` block
   so the browser submits normally.
