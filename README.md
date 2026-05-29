# JSong Realty — Website

Real-estate site for **Joshua Song**, REALTOR® with **Keller Williams**, Atlanta, GA.

Static [Astro](https://astro.build/) site. Custom design (warm cream / clay / terra palette, Fraunces serif + Inter sans). Deploys to GitHub Pages.

---

## Run it

```bash
./start.sh        # installs deps if needed, then opens http://localhost:4321/
```

Or manually:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs static site to dist/
npm run preview   # serves dist/ locally for a final sanity check
```

## Deploy (GitHub Pages)

1. Push to GitHub `main`.
2. Set up a GitHub Actions workflow that runs `npm run build` and deploys `dist/` to the `gh-pages` branch (or use the official `actions/deploy-pages` action).
3. In repo Settings → Pages → set source to `gh-pages` branch.
4. `public/CNAME` ensures the custom domain (`jsongrealty.com`) survives every deploy.

---

## File layout

```
src/
├── pages/
│   ├── index.astro              # /
│   ├── about/index.astro        # /about/
│   ├── buyers/index.astro       # /buyers/
│   ├── sellers/index.astro      # /sellers/
│   ├── contact/index.astro      # /contact/
│   ├── listings/index.astro     # /listings/  — FMLS Matrix IDX iframe
│   └── blog/index.astro         # /blog/
└── layouts/
    └── Layout.astro             # HTML shell, header, footer, font loading

public/
├── CNAME                        # jsongrealty.com
└── assets/
    ├── css/styles.css           # Design system (1,580 lines, tokens + components)
    └── js/
        ├── api-config.js        # Brand info (name, phone, email)
        ├── main.js              # Nav, forms, brand auto-fill
        ├── reviews.js           # Reviews grid hydration
        └── lead-magnet.js       # Buyer/Seller guide forms
```

---

## Listings — current state

`/listings/` embeds the FMLS Matrix IDX (`matrix.fmlsd.mlsmatrix.com/Matrix/public/IDX.aspx?idx=cde7311d`) as an iframe.

This is a temporary measure. FMLS may issue updated embed code or (less likely) a data-feed API. When they do, swap the iframe in `src/pages/listings/index.astro` for the new integration. The rest of the page (header, market pills, CTA band, footer) stays the same.

---

## Edit brand info

Phone, email, agent name, brokerage, Instagram, license — all live in `public/assets/js/api-config.js`. Edit there; `main.js` populates every `data-brand-*` attribute across the site.

For SEO text (titles, meta descriptions, headings), edit the individual `.astro` pages.

---

## Defaults already in place

- Semantic HTML, keyboard-navigable, ARIA labels on icon-only buttons
- `prefers-reduced-motion` honored
- Responsive: mobile-first, nav collapses under 880px
- Zero tracking by default — add analytics yourself if needed
- All routes use `/section/` trailing slash
