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
- North Pole’s hosting account, database, and all live tokens

Kept and relabeled: dashboard chrome, customer list + detail sheet, inventory list, Meta ads tiles, settings drawer, staff and tasks shells.

## Icon

The live icon is Nick’s snowman (red hat and scarf, holding a rainbow shaved-ice cup, gold star on a navy sky). The original rounded-tile art is `icons/nick-snowman-original.png`. It is converted to a full-bleed square (`icons/nick-snowman-fullbleed.png`) so iOS can apply its own mask; the maskable variant adds padding.

Earlier SVG options A–C (a snow globe in North Pole’s art style) are still in `icons/` for reference, but they are not used by the app.

App files: `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, plus `favicon-32.png` / `favicon.ico`.



## Themes

The app ships ten looks that share the same layout, spacing and components. Switch with an `html.theme-*` class, Settings › Look, or a query param (`?theme=a` through `?theme=j`). Theme 1 · Rainbow Syrup (`?theme=c`) is the default.

- 1 · Rainbow Syrup (default) — https://f7jvtdrgw6-commits.github.io/south-pole/ or `?theme=c`
- A · Icy blue — `?theme=a`
- B · Mint & glacier — `?theme=b`
- 2 · Icon Match — `?theme=d`
- 3 · North Pole Classic — `?theme=e`
- 4 · Summer Stand — `?theme=f`
- 5 · Cotton Candy — `?theme=g`
- 6 · Blue Raspberry — `?theme=h`
- 7 · Midnight Mono — `?theme=i`
- 8 · Light Mode Snow — `?theme=j`

Each theme has its own top-decoration treatment in the slot that used to hold the C9 light string (snowflakes, snow-dust, syrup drips, stars, a gold hairline, fruit, cotton-candy clouds, a neon bar, a red tick, or icy flakes on white).


## Data and a free hookup later

`data.js` is a static example snapshot (the numbers and abbreviated names from the South Pole mockups). It is not live Square, Meta, or coupon-sheet data.

North Pole runs on Cloudflare Pages + D1 + Functions, but that project was never fully deployed (it needed Zero Trust / Access). South Pole is hosted the same way **Scoop / Ice Scout** is: a public GitHub Pages site on the `f7jvtdrgw6-commits` account, which is free.

When Nick wants live data, a free path that stays off North Pole’s account:

1. Re-export the coupon sheets (and later Square / Meta) into the box.
2. Publish aggregates — and any customer PII only inside an encrypted `data.enc.json`, like Scoop — then push to this repo.
3. Optional later: a separate free-tier Cloudflare Pages project named `south-pole`, never North Pole’s project, database, or tokens.

Push notifications would also need a free web-push endpoint; they are not wired in this build.

## Local

Serve the `app/` folder (or the repo root, which is what Pages serves):

```bash
python3 -m http.server 8080 --directory app
```

Add to an iPhone home screen from Safari: Share → Add to Home Screen. Name: **South Pole**.

Cache bust: bump the service worker name in `sw.js` (`southpole-v7` today) when shipping a visible change, then close and reopen the home-screen app.
