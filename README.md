# EmanuelGrooming
#1 freelance website

Front page for **Emanuel Pet Grooming** (212 S Atlantic Blvd, Ste 104, East Los Angeles): a luxury, parallax, bubble-themed one-pager.
Plain HTML/CSS/JS, no build step.

## Run it

```bash
python3 -m http.server 5173
# then open http://localhost:5173/
```

## What's where

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page (header, hero, studio, packages, bubble field, visit, gallery, portal teaser, contact, FAQ, footer, dialogs) |
| `Grooming/CSS/luxe.css` | All styling. Palette and type tokens are at the top (`:root`) |
| `Grooming/javascript/luxe.js` | Smooth scroll, parallax loop, filling tub, lightbox and dialogs, preloader |
| `Grooming/javascript/luxe-bubbles.js` | The interactive canvas bubbles (drift, react to scroll + cursor, pop on tap) |
| `Grooming/javascript/vendor/lenis.min.js` | Lenis 1.1.20 (smooth scrolling), vendored so the site works offline |
| `Grooming/assets/img/happy-tails/` | Customer and dog photos as WebP (`-400` and `-768` widths) |
| `Grooming/assets/brand/` | Cropped logo, favicon, touch icon, social image |
| `Grooming/assets/fonts/` | Self-hosted Bodoni Moda, Hanken Grotesk, Sacramento |
| `.github/workflows/pages.yml` | Publishes the site when `Master` changes |

`Grooming/CSS/modern-grooming.css`, `Grooming/javascript/modern-grooming.js` and the rest of `Grooming/html/` belong to the previous
version of the site and are no longer used by the root `index.html`. `Grooming/html/index.html` still links to them, so they were left in place.

## How the motion works

- **Smooth scroll:** Lenis on desktop pointers only. Touch devices keep native momentum scrolling.
- **Parallax:** any element with `data-depth="n"` (positive = far away and slower, negative = in front and faster). `data-mouse="px"` adds cursor drift. The depth-to-speed curve is `depthToSpeed()` at the top of `luxe.js`.
- **Packages:** the three service packages (Full, Basic, Spa) are sticky cards that stack as you scroll. It is pure CSS. All three cards share one minimum height (`--pkg-min`) so a taller card never shows beneath a shorter one.
- **Fresh from the tub:** a field of seven dog-only photo bubbles. It scales with the container on desktop and tablet and becomes a staggered two-column grid on phones. Each bubble opens the lightbox.
- **Bubbles:** one fixed canvas under the content. Tap or click an empty area to pop one.
- **Reduced motion:** `prefers-reduced-motion` disables smooth scroll, parallax, the preloader and the marquee, and shows everything statically.
- **No JS:** the page is fully readable; reveal effects only activate when scripts run.

## Business details on the page

These came from the shop's flyer and Instagram profile.

- **Phone:** `(323) 557-6203` (search for `3235576203` to change it). The flyer also lists `(323) 535-7091`, which is not shown on the site.
- **Address:** Freeway Plaza, 212 S Atlantic Blvd, Ste 104, Los Angeles, CA 90022.
- **Hours:** Tue-Fri 10:00 am - 4:30 pm, Sat 8:00 am - 5:00 pm, closed Sun and Mon. The flyer says Saturday closes at 5:00 pm but the Instagram bio says 5:30 pm, so confirm which is right.
- **Packages:** Full (bath, haircut, teeth cleaning, ear cleaning, nail trim, anal gland cleaning, free bandana or bow), Basic (bath and haircut), Spa (bath and anal gland cleaning). No prices are shown yet, so each card says "Call or text for pricing".
- **Social:** Instagram `@emanuelpetgrooming` is linked. The Facebook page is not linked because its URL is unknown.

## Before going live: confirm these details

1. **Pricing.** Add prices to the three package cards in `index.html` (`.pkg-foot`) once you have them.
2. **Older copy.** Some wording came from the previous site and was not confirmed: the "disinfected between visits" and "rest, stretch and fresh water" lines in the Studio section, the rabies and kennel-cough rule in the FAQ, and the "calm, one-on-one" description. Keep what is true.
3. **Rating / review counts.** The old "4.9 stars, 150+ reviews" and the made-up testimonials were removed. Add real figures only if you can back them up.
4. **Photo permission.** The gallery and hero use photos of real customers (including children). Make sure you have their OK to publish them.
5. **Share image.** `og:image`, the canonical link and the structured data already use `https://emanuelpetgrooming.com`. If the domain ever changes, update them in `index.html` along with `robots.txt` and `sitemap.xml`.

## Client portal

The portal is intentionally a "Coming soon" teaser: loyalty points, online booking, pet history and grooming progress. There is no login form and nothing is collected. When it is built, the button in the header and the dialog in `index.html` (`#portalDialog`) are the places to wire up.
