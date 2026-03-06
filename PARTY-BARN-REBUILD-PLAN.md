# Party Barn Rebuild Plan (Revised)

## Executive Summary

**Approach (locked in):** Next.js + Vercel + headless Shopify Storefront API. No SquareSpace, no Hydrogen, no “Shopify buttons on SquareSpace”—one custom site, one commerce backend (Shopify for POS + online), full design control, and store pickup.

**Goal:** Replace the current SquareSpace site with a single Next.js site that (1) serves the client’s **current** scenario (pre-launch, opening Spring 26’), and (2) sets Party Barn Mercantile up for success for their **brick & mortar launch** and beyond.

---

## 1. Brand & Current State (Unchanged)

### 1.1 Brand Board Summary

| Element | Spec |
|--------|------|
| **Brand name** | Party Barn Mercantile |
| **Location** | Old Town Murrieta, California |
| **Tagline** | Rooted in Celebration |
| **Primary font** | Sauvage Serif (logo, headlines, web titles) |
| **Body font** | JetBrains Mono (descriptions, paragraphs, pricing) |
| **Accent font** | Script – use sparingly |
| **Palette** | `#b8a999`, `#e4e2d7`, `#f7f8f3`, `#2c2c2c`, `#dee6e8`, `#9d755c` |
| **Keywords** | Curated, Modern, Celebratory, Thoughtful, Elevated, Timeless |
| **Graphics** | Delicate line illustrations (balloons, gift bags, cakes, confetti, stars, ribbons) – thin line, minimal, vintage-inspired |

### 1.2 Current Site & Shopify

- **party-barn.com (SquareSpace):** Hero, services, why Party Barn, footer with “Opening Spring 26’” and address. To be replaced.
- **party-barn-mercantile.myshopify.com:** Password-protected “Opening soon”; single backend for POS + headless storefront.

---

## 2. Architecture (Next.js + Headless Shopify)

```
┌─────────────────────────────────────────────────────────────────┐
│  Next.js app (Vercel)                                           │
│  • Marketing: Home, Event Styling, Gallery, Visit Us, Contact    │
│  • Balloon Order (form and/or Shopify products)                  │
│  • Shop: collections, product pages, cart, checkout             │
│  • Store pickup messaging (Storefront API)                      │
│  • Optional: “Ask Party Barn” chat (xAI Grok)                   │
└───────────────────────────┬───────────────────────────────────┘
                             │  Storefront API (GraphQL)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Shopify (party-barn-mercantile.myshopify.com)                   │
│  • Products, inventory, locations, POS, orders, local pickup     │
└─────────────────────────────────────────────────────────────────┘
```

**Domain:** party-barn.com → Vercel. Shopify remains backend only (myshopify.com or custom checkout domain as needed).

---

## 3. Site Structure (Refined for B&M Launch)

The original set (Home, Event Styling, Gallery, Get In Touch, Balloon Order, Shop) is good. One refinement is recommended for the brick & mortar launch: **split “Get In Touch” into two clear destinations** so “where to visit” and “how to contact” each have a home. That supports pre-launch (“when do you open?” / “where are you?”) and post-launch (“what are your hours?”).

**Recommended routes:**

| Route | Purpose |
|-------|--------|
| `/` | **Home** – Hero (“Evoking a Sense of Magic”), services, why Party Barn, opening Spring 26’ CTA, link to Visit Us. |
| `/event-styling` | Event styling + rentals. |
| `/gallery` | Gallery. |
| `/shop` | Collection listing (Shopify). |
| `/shop/[handle]` | Product page with **store pickup** (“Pick up at Party Barn – Murrieta”). |
| `/balloon-order` | Balloon order form (and/or links to balloon products in Shop). |
| `/visit` | **Visit Us** – Address (24977 Washington Ave, Suite E; entrance faces Ivy Street), hours (e.g. “Opening Spring 26’ – hours to be announced”), directions, opening announcement, optional map embed. *Primary “where & when” page for B&M launch.* |
| `/contact` | **Contact** – Form for inquiries, event styling requests, general questions. |
| Cart / Checkout | Via Storefront API → Shopify checkout (with local pickup option). |

**Navigation (suggested):**  
Home · Event Styling · Gallery · Shop · Balloon Order · Visit Us · Contact  

(Order can be tuned; “Visit Us” and “Contact” can sit in nav or under a single “Get In Touch” dropdown if you prefer fewer nav items.)

**Rationale:** A dedicated **Visit Us** page gives one clear link for “where are you?” and “when do you open?”—critical for a new B&M opening. **Contact** stays focused on sending a message. Together they replace the single “Get In Touch” page with a structure that scales from pre-launch to open.

---

## 4. Brick & Mortar Launch Readiness

Concrete items so the site supports the client **now** (pre-launch) and **at open**:

### 4.1 Pre-Launch (Current State)

- **Opening message** – “Opening Spring 26’” visible on Home and Visit Us (and footer).
- **Visit Us** – Address, “Entrance faces Ivy Street,” “Hours to be announced” or placeholder hours.
- **Newsletter** – Capture “notify me when we open” (Shopify customer/email or existing tool) linked from Home and Visit Us.
- **Contact** – Form live so event styling and balloon inquiries can come in before the store opens.
- **Shop** – Can stay “coming soon” or show a limited catalog with “Available for store pickup when we open” if products are ready in Shopify.

### 4.2 At Launch (Spring 26’)

- **Hours** – Update Visit Us (and footer) with real opening hours.
- **Local pickup** – Turn on in Shopify for Murrieta location; product pages show “Available for pickup at Party Barn” and pickup time.
- **Remove “opening soon”** – Replace with “Open” / “Visit us” messaging where appropriate.
- **Local SEO** – Title/meta and content for “Party Barn Mercantile,” “Old Town Murrieta,” “Murrieta party supplies,” “balloons Murrieta,” etc., especially on Home and Visit Us.

### 4.3 Post-Launch

- **One source of truth** – All orders (in-store POS + online) in Shopify; one inventory, one admin.
- **Store pickup** – Customers can order online and pick up at 24977 Washington Ave; Storefront API + Shopify local pickup handle availability and checkout.

---

## 5. Technical Plan

### 5.1 Stack

- **Framework:** Next.js 14+ (App Router).
- **Hosting:** Vercel.
- **Commerce:** Shopify Storefront API (GraphQL).
- **Styling:** Tailwind CSS; brand palette and fonts (Sauvage Serif, JetBrains Mono).
- **Fonts:** Sauvage Serif + JetBrains Mono (e.g. Google Fonts or self-host).

### 5.2 Shopify Setup

1. **Headless channel or custom app** in Shopify Admin with Storefront API access.
2. **Scopes:** Include `unauthenticated_read_product_pickup_locations` for local pickup.
3. **Local pickup:** Enable for Murrieta location (Settings → Shipping and delivery → Local pickup).
4. **Environment variables (Vercel):**
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=party-barn-mercantile.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN=...`

### 5.3 Store Pickup Flow

1. **Product page:** Query `storeAvailability` (and optionally `locations`) via Storefront API per variant.
2. **UI:** Show “Available for pickup at Party Barn – Usually ready in X” and address.
3. **Checkout:** Customer chooses “Local pickup” at Shopify checkout (Murrieta location).
4. **Optional:** Use `@inContext(preferredLocationId: "gid://shopify/Location/...")` so Murrieta is default.

### 5.4 Content & Brand

- Use **Party Barn Mercantile** and **Rooted in Celebration** where appropriate.
- Align all type and colors to the brand board; add delicate line illustrations (balloons, confetti, etc.) as specified.

### 5.5 Balloon Order

- **Recommended:** Hybrid – custom form on `/balloon-order` for bespoke requests; link to Shop for any standard balloon products in Shopify. Form submits via Next.js API route (e-mail or client’s preferred endpoint).

---

## 6. Optional: AI (“Ask Party Barn”) with xAI Grok

**Not required for launch;** can be added when the client is ready.

### 6.1 Idea

A small **“Ask Party Barn”** experience: customers can ask short questions (e.g. “What balloons do you have for a baby shower?”, “What are your hours?”, “Do you do event styling for weddings?”). The model answers in the voice of the brand using provided context.

### 6.2 Implementation Outline

- **Model:** xAI **Grok-4-1-fast-reasoning** via [xAI API](https://docs.x.ai/developers/quickstart) (model id: `grok-4-1-fast-reasoning`). Good for quick, coherent answers and optional longer context (e.g. FAQ + store info).
- **API key:** Client (or you) creates key at [console.x.ai](https://console.x.ai); store in Vercel as `XAI_API_KEY` (server-only).
- **Next.js:** One API route (e.g. `POST /api/ask`) that:
  - Accepts user message and optional conversation history.
  - Sends to xAI with a **system prompt** that includes: brand name, tagline, location, address, services (balloons, party supplies, event styling), store pickup, “Opening Spring 26’” or current hours, and a short FAQ. No PII in the prompt.
  - Returns the model reply as streaming or single response.
- **UI:** Floating chat button and a small chat panel (or a section on Visit Us / Contact). Keep it simple: a few exchanges, no login required.

### 6.3 Guardrails

- System prompt instructs: answer only about Party Barn, celebrations, and store info; do not give medical/legal advice or make up products/prices; if unsure, suggest calling or using the contact form.
- Optional: rate limit by IP to avoid abuse; optional simple moderation if the client wants to avoid certain topics.

### 6.4 When to Add

- **Phase 2** after core site and B&M launch are stable, or in parallel if bandwidth allows. Launch does not depend on it.

---

## 7. Migration & Launch Checklist

### Phase 1 – Foundation & Pre-Launch

1. **Design** – Key pages (Home, Visit Us, Contact, Event Styling, Gallery, Shop shell) using brand board.
2. **Build** – Next.js app on Vercel; marketing pages; Visit Us with address and “Opening Spring 26’”; Contact form.
3. **Shopify** – Headless channel (or app), Storefront token, local pickup enabled for Murrieta; add/import products as ready.
4. **Shop** – `/shop` and `/shop/[handle]` with Storefront API; store pickup messaging on PDPs.
5. **Balloon order** – `/balloon-order` form (and links to balloon products if any).
6. **Content** – Copy and visuals aligned to brand board; “Opening Spring 26’” and Visit Us clear.
7. **Domain** – party-barn.com → Vercel; retire SquareSpace.

### Phase 2 – B&M Launch (Spring 26’)

8. **Hours** – Update Visit Us and footer with real hours.
9. **Messaging** – Replace “opening soon” with “Open” / “Visit us” where appropriate.
10. **Local SEO** – Finalize titles/descriptions for Murrieta and Old Town.
11. **QA** – Full flow: browse → product → cart → checkout with local pickup.

### Phase 3 – Optional

12. **AI** – Add “Ask Party Barn” with xAI Grok (API route + chat UI + `XAI_API_KEY`).

---

## 8. Next Steps

1. **Client** – Confirm site structure (especially Visit Us + Contact) and balloon form behavior; confirm SquareSpace can be retired after cutover.
2. **Shopify** – Create Headless channel, get token, enable local pickup for Murrieta.
3. **Design** – Lock layouts and components (typography, palette, illustrations).
4. **Build** – Implement in order: marketing pages → Visit Us & Contact → Shop & cart & checkout → balloon order; then B&M launch updates; then optional AI.

---

*Revised plan: Next.js + headless Shopify only; site structure refined for B&M launch (Visit Us + Contact); optional xAI Grok “Ask Party Barn” in a later phase.*
