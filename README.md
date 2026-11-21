# South Pole

A standalone PWA hub for **Kiraboos**, Nick’s shaved-ice business (St. Peters / SNOCRAVE and Ellisville / SNOFIX). It is the sister app to **North Pole** (Saint Nick’s Lights): same look, typography, cards, string of lights, and floating tab bar, with lights-only features removed.

**Live:** https://f7jvtdrgw6-commits.github.io/south-pole/

This build uses **example data only**. No real customer names, phones, emails, or tokens are in the repo. Nothing from North Pole’s Cloudflare, D1, Jobber, or Access setup is reused.

## What’s in the app

Bottom tabs (same chrome as North Pole, relabeled for shaved ice):

| Tab | What it shows |
|---|---|
| **Home** | Season revenue, coupon funnel, customers, Meta ROAS, code pool, low stock. Store switcher: All / St. Peters / Ellisville. |
| **Meta** | Ad spend, ROAS, cost per redeem, claim→redeem, funnel by store, A/B splits. Date range: 7D / 30D / YTD / Custom. |
| **Customers** | Searchable Jobber-style list of campaign customers (code, claimed/redeemed, spent). Tap a row for a detail sheet and an “Open in Square” placeholder. |
| **Sales** | Today / week / month revenue, average ticket, coupon vs organic, top items. |
| **Inventory** | Syrups, ice, cups, toppings; low-stock bars and a reorder list, by store. |

Settings (gear, same slide-over as North Pole) has an example **Staff** roster and **Tasks** list. Those are placeholders until a free backend exists.

## What was removed from North Pole

Lights-only pieces were not carried over:

- Takedown routes, stop cards, install maps, takedown photos
- Roofline measuring and lighting mockups
- Wreath / bow inventory and wreath passes
- Lighting quotes, lead pipeline, Jobber job materials
- Rebooking / churn / LTV-for-installs tiles
- North Pole’s Cloudflare Access, D1, R2, VAPID keys, and all live tokens

Kept and relabeled: dashboard chrome, customer list + detail sheet, inventory list, Meta ads tiles, settings drawer, staff and tasks shells.

## Icon

Drawn the same way as North Pole’s current icon (`northpole/icon-options/ref1/gen.py`): hand-authored SVG, rendered with cairosvg, same navy sky, gold 4-point star, sparkles, and snowy mound.

Options are in `icons/`:

- `option-A-classic.png` — gold stand
- `option-B-bold.png` — larger globe and snowman
- **`option-C-stripe-base.png` (chosen)** — candy-stripe stand so it feels like the same company made both icons
- `comparison.png` — North Pole’s icon next to A, B, and C

The live app uses option C (`apple-touch-icon.png` 180, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`). Regenerate with `python3 tools/gen_icon.py`.

## Data and a free hookup later

`data.js` is a static example snapshot (the numbers and abbreviated names from the South Pole mockups). It is not live Square, Meta, or coupon-sheet data.

North Pole runs on Cloudflare Pages + D1 + Functions, but that project was never fully deployed (it needed Zero Trust / Access). South Pole is hosted the same way **Scoop / Ice Scout** is: a public GitHub Pages site on the `f7jvtdrgw6-commits` account, which is free.

When Nick wants live data, a free path that stays off North Pole’s account:

1. Re-export the coupon sheets (and later Square / Meta) into the box.
2. Publish aggregates — and any customer PII only inside an encrypted `data.enc.json`, like Scoop — then push to this repo.
3. Optional later: a separate free-tier Cloudflare Pages + D1 project **named `south-pole`**, never the North Pole project, database, or tokens.

Push notifications would also need a free web-push endpoint; they are not wired in this build.

## Local

Serve the `app/` folder (or the repo root, which is what Pages serves):

```bash
python3 -m http.server 8080 --directory app
```

Add to an iPhone home screen from Safari: Share → Add to Home Screen. Name: **South Pole**.

Cache bust: bump the service worker name in `sw.js` (`southpole-v1` today) when shipping a visible change, then close and reopen the home-screen app.
