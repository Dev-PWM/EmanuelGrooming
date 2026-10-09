# EmanuelGrooming
#1 freelance website

Front page for **Emanuel Pet Grooming** (East Los Angeles): a luxury, parallax, bubble-themed one-pager.
Plain HTML/CSS/JS, no build step.

## Run it

```bash
python3 -m http.server 5173
# then open http://localhost:5173/
```

## What's where

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page (header, hero, studio, services, visit, gallery, portal teaser, contact, FAQ, footer, dialogs) |
| `Grooming/CSS/luxe.css` | All styling. Palette and type tokens are at the top (`:root`) |
| `Grooming/javascript/luxe.js` | Smooth scroll, parallax loop, pinned services rail, filling tub, dialogs, preloader |
| `Grooming/javascript/luxe-bubbles.js` | The interactive canvas bubbles (drift, react to scroll + cursor, pop on tap) |
| `Grooming/javascript/vendor/lenis.min.js` | Lenis 1.1.20 (smooth scrolling), vendored so the site works offline |
| `Grooming/assets/img/happy-tails/` | Customer photos as WebP (`-400` and `-768` widths) |
| `Grooming/assets/brand/` | Cropped logo, favicon, touch icon, social image |
| `Grooming/assets/fonts/` | Self-hosted Bodoni Moda, Hanken Grotesk, Sacramento |

`Grooming/CSS/modern-grooming.css`, `Grooming/javascript/modern-grooming.js` and the rest of `Grooming/html/` belong to the previous
version of the site and are no longer used by the root `index.html`. `Grooming/html/index.html` still links to them, so they were left in place.

## How the motion works

- **Smooth scroll:** Lenis on desktop pointers only. Touch devices keep native momentum scrolling.
- **Parallax:** any element with `data-depth="n"` (positive = far away and slower, negative = in front and faster). `data-mouse="px"` adds cursor drift. The depth-to-speed curve is `depthToSpeed()` at the top of `luxe.js`.
- **Pinned services rail:** on desktop (≥1025px, mouse) the Services section pins and scrolls sideways. On touch and tablets it becomes a swipeable snap row. If the viewport is too short, the stage compacts itself (`fit-1`, `fit-2`) before giving up and falling back to the swipe row.
- **Bubbles:** one fixed canvas under the content. Tap or click an empty area to pop one.
- **Reduced motion:** `prefers-reduced-motion` disables smooth scroll, parallax, the preloader and the marquee, and shows everything statically.
- **No JS:** the page is fully readable; reveal effects only activate when scripts run.

## Before going live: confirm these details

The business facts below were carried over from the previous version of the site and could not be verified from the photos alone.

1. **Phone number.** Every link uses `(323) 895-7164` (search for `3238957164`). The tote bags in the photos show a different set of digits (ending in `-6203`/`-8203` and `-7091`) plus "Ste. 104" and ZIP 90022. Confirm the right number and replace it everywhere.
2. **Prices, durations, hours, vaccine policy, FAQ answers.** Check each against what the shop really offers.
3. **Rating / review counts.** The old "4.9 stars, 150+ reviews" and the made-up testimonials were removed. Add real figures only if you can back them up.
4. **Photo permission.** The gallery uses photos of real customers (including children). Make sure you have their OK to publish them.
5. **Share image.** `og:image` is a relative path. Replace it with the full URL (`https://your-domain/...`) once the site has a domain, so link previews work.

## Client portal

The portal is intentionally a "Coming soon" teaser: loyalty points, online booking, pet history and grooming progress. There is no login form and nothing is collected. When it is built, the button in the header and the dialog in `index.html` (`#portalDialog`) are the places to wire up.
