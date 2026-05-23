# JSong Realty — Website

Static, performance-first real-estate site for **Joshua Song**, REALTOR® with **Keller Williams**, Atlanta, GA.
Built from the architectural blueprint in `jsongrealty.pdf` — no build step, host anywhere, drop-in API keys when ready.

---

## File structure

```
.
├── index.html                      # Home
├── about/index.html                # About
├── listings/
│   ├── index.html                  # Search + map
│   └── sample-property/index.html  # Property detail template
├── buyers/index.html
├── sellers/index.html
├── blog/
│   ├── index.html                  # Blog index
│   └── sample-post/index.html      # Article template
├── contact/index.html
└── assets/
    ├── css/styles.css              # Design system
    └── js/
        ├── api-config.js           # EDIT ME — API keys + contact info
        ├── main.js                 # Nav, forms, brand auto-fill
        └── listings.js             # SimplyRETS + Mapbox integration
```

Each page lives in its own subdirectory so URLs are clean (`/about/`, `/listings/`, etc.) and easy to rearrange without breaking links.

---

## Running it

No build step. Just serve the folder:

```bash
# From this directory
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000/.

---

## Plug-in API keys (5 minutes)

Open `assets/js/api-config.js` and fill in the following. The site is already wired to consume them.

### 1. SimplyRETS — IDX / MLS listings (recommended)

This is the "organic IDX" approach the blueprint recommends: real, indexable listing pages instead of an iframe.

1. Create an account: https://simplyrets.com/pricing
2. Copy your **username** and **password** from the dashboard.
3. Paste into `JSONG_CONFIG.simplyRETS`:

```js
simplyRETS: {
  username: "your_simplyrets_username",
  password: "your_simplyrets_password",
  baseUrl: "https://api.simplyrets.com",
  featuredLimit: 3,
  defaultLimit: 12,
}
```

> The site ships with the public `simplyrets / simplyrets` sandbox creds, which return demo listings immediately. Everything works out of the box — swap them for real creds when you're ready.

### 2. Mapbox — interactive map on `/listings/`

1. Create a free account: https://account.mapbox.com/
2. Copy your **Default public token** (`pk.ey...`).
3. Paste into `JSONG_CONFIG.mapbox.accessToken`.

The `/listings/` page will replace its decorative placeholder with a real, interactive map with viewport-bounds loading (fetches listings visible on-screen only, per the blueprint).

### 3. Contact form endpoint

The contact form logs to console until you add an endpoint. Drop in a Formspree / Basin / Getform endpoint:

```js
contactForm: {
  endpoint: "https://formspree.io/f/YOUR_ID",
}
```

### 4. (Optional) Saleswise / LLM search

Stubbed in config. When you're ready to enable natural-language search or instant CMAs, flip the `enabled` flag and provide keys. Always proxy the LLM call through your own server — never ship the key in the browser.

---

## Swapping realtor info

All brand info (name, phone, email, brokerage, city, Instagram link) pulls from `JSONG_CONFIG.brand` in `api-config.js`. The HTML uses `data-brand-*` attributes that get populated by `main.js` — edit one place, it updates everywhere.

For SEO text (title tags, meta descriptions, page headings), do a find-and-replace across the HTML files:

| Find | Replace with |
| --- | --- |
| `Joshua Song` | New name |
| `JSong Realty` | New brand |
| `Keller Williams Realty` | New brokerage |
| `Atlanta, GA` | New city |

---

## Which API did I pick, and why?

From the plan in the PDF:

- **SimplyRETS** was chosen over raw RESO, Showcase IDX, or legacy iframe plugins because it exposes a single REST API across every MLS board, ships a public sandbox (so the site works *immediately*), and returns data in a shape that renders to indexable DOM — the single biggest SEO lever vs. kw.com-style iframes. (See rows 11–15 of the Works Cited in the blueprint.)
- **Mapbox GL JS** over Google Maps or Leaflet because it supports viewport-bounds loading + marker clustering out of the box, which is the exact pattern the blueprint recommends for the kw.com "clunky map" problem. Free tier is generous for a single-agent site.

If you want to switch later, both are isolated behind thin wrappers in `assets/js/listings.js` — swap one function and the rest of the site doesn't care.

---

## Hosting

Any static host works:

- **Netlify** — drag this folder onto the Netlify dashboard.
- **Vercel** — `vercel deploy` from this directory.
- **Cloudflare Pages** — connect a GitHub repo.
- **GitHub Pages** — push to `gh-pages` branch.
- **S3 + CloudFront** — for more control.

All routes are `/section/index.html` so "pretty URLs" work out of the box with any of the above.

---

## Accessibility, performance, privacy — defaults already in place

- Semantic HTML: `<header>`, `<nav>`, `<main>` sections, `<footer>`, `<article>`, `<aside>`.
- Keyboard-navigable; focus rings preserved; ARIA labels on icon-only buttons.
- Prefers-reduced-motion honored.
- System-font fallback if Google Fonts are blocked.
- Responsive breakpoints: mobile-first, nav collapses under 880px.
- Zero tracking scripts by default. Add your own analytics if you want (PostHog, Plausible, GA4 — your call).
- Contact form never logs sensitive info in production (endpoint is HTTPS Formspree-style).

---

## Questions

Anything unclear, reach me in the chat and I'll adjust.
