# Party Barn Mercantile

Next.js site for Party Barn Mercantile — premium balloons, curated party goods, and event styling in Old Town Murrieta. Built with Next.js 15 (App Router), Tailwind CSS, and prepared for headless Shopify.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

- **`app/`** — Routes: Home, Event Styling, Gallery, Shop, Balloon Order, Visit Us, Contact; Privacy & Terms placeholders.
- **`components/`** — Header (nav + mobile menu), Footer.
- **`public/images/gallery/`** — Gallery and logo images (from `Images/`), used by the site.
- **Brand** — Tailwind theme in `tailwind.config.ts` (brand colors, fonts). Serif = Playfair Display (stand-in for Sauvage Serif); body = JetBrains Mono; script = Madison Sauvage Script (local). Swap in Sauvage Serif via local font when available.

## Design notes

- Consistent section spacing (`section-spacing`, `section-spacing-tight`) and container widths (`container-narrow`, `container-wide`) to avoid the cramped layout of the original site.
- Clear hierarchy: serif for headings, mono for body; brand palette only.
- Visit Us and Contact are separate pages for B&M launch.

## Next steps (from plan)

- Connect contact and balloon-order forms to an API (e.g. email or client backend).
- Add Shopify Storefront API for Shop (products, cart, checkout, store pickup).
- Replace Cormorant with Sauvage Serif when the font is available.
# party-barn
