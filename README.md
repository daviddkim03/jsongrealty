# JSong Realty

Website for **Joshua Song**, REALTOR® with **Keller Williams Realty**, Atlanta, GA. Live at [jsongrealty.com](https://jsongrealty.com).

A static [Astro](https://astro.build/) site styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, Neutral base color, dark theme). Headings use Fraunces, body text uses Inter, and icons come from [react-icons](https://react-icons.github.io/react-icons/). Deploys to GitHub Pages.

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

## Scripts

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Dev server at http://localhost:4321/                |
| `npm run build`        | Static build to `dist/`                             |
| `npm run preview`      | Serves `dist/` locally for a final check            |
| `npm run check`        | Type-checks `.astro`, `.ts`, and `.tsx` files       |
| `npm run format`       | Formats with Prettier (also sorts Tailwind classes) |
| `npm run format:check` | Verifies formatting without writing                 |

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `withastro/action` and publishes `dist/` to GitHub Pages. `public/CNAME` keeps the custom domain (`jsongrealty.com`) on every deploy.

---

## File layout

```
src/
├── config/site.ts           # Brand, contact details, form endpoints, nav links
├── data/
│   ├── listings.ts          # Homes shown on / (first three) and /listings/
│   └── reviews.ts           # Client testimonials (first three are shown)
├── pages/                   # One .astro file per route, plus 404.astro
├── layouts/Layout.astro     # HTML shell, SEO meta, header, footer
├── components/
│   ├── ui/                  # shadcn/ui components (generated, then owned here)
│   ├── site/                # Header, footer, and section building blocks
│   ├── listings/            # Listing cards with a quick-view dialog (island)
│   └── forms/               # Contact, valuation, and guide forms (islands)
├── lib/                     # cn(), formatting, and image URL helpers
├── scripts/                 # Small vanilla scripts: header state, scroll reveal
└── styles/global.css        # Tailwind entry point and shadcn theme tokens

public/
├── CNAME                    # jsongrealty.com
├── favicon.svg
└── assets/
    ├── img/                 # Headshot
    └── guides/              # Seller's guide PDF (built by scripts/build-seller-guide.sh)
```

---

## Editing content

- **Contact details, brokerage, Instagram:** `src/config/site.ts`. Everything is rendered at build time, so edit and redeploy.
- **Listings:** `src/data/listings.ts`. The current entries are sample homes; replace them with real listings. `photo` takes an Unsplash photo id or any image URL (or a path under `public/`).
- **Reviews:** `src/data/reviews.ts`. Home and About show the first three.
- **Page copy, titles, and meta descriptions:** the matching file in `src/pages/`.

The site has no listing search or MLS integration: listings are a curated, hand-edited set.

## Forms

The contact, home-valuation, and seller's-guide forms POST JSON to the endpoints in `site.forms` (any Formspree, Getform, or Basin style endpoint works). Until an endpoint is set:

- the contact and valuation forms open the visitor's email app with the message pre-filled and addressed to Joshua, so no inquiry is silently dropped;
- the guide form just downloads the PDF.

A listing's "Request a showing" button links to `/contact/?listing=<id>`, which pre-fills the contact message for that home.

---

## UI conventions

- **Components** come from shadcn/ui: `npx shadcn@latest add <component>`. This site uses react-icons instead of lucide-react, so after adding a component, swap its `lucide-react` imports for the matching `react-icons/lu` icon (for example `XIcon` becomes `LuX`).
- **Links that look like buttons** in `.astro` files use `buttonVariants()` on a plain `<a>`. Avoid `<Button asChild>` there: Astro wraps slotted children in an extra element, which breaks Radix's `asChild` and shadcn's direct-child selectors. Compose shadcn components inside `.tsx` files and give them plain props.
- **Hydration** is opt-in. Only the mobile menu, listing dialogs, and forms ship JavaScript (`client:*`); everything else renders to static HTML.
- **Theme** is dark-only: `<html class="dark">` with shadcn's Neutral tokens in `src/styles/global.css`.
- **Accessibility:** semantic landmarks, a skip link, keyboard-friendly Radix dialogs and selects, and `prefers-reduced-motion` turns off the scroll reveal.
