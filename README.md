# Postcard

A Tourground Launch Pad template for a destination travel brand: one long, editorial home page with a full-bleed photo hero, a giant wordmark, four numbered "start here" links, a journeys index, a dark three-panel band, a twelve-month calendar, story cards, a photo call to action and a menu-card footer.

Everything brand-specific lives in **`site.config.mjs`**. The build is a single Node script with no dependencies that writes a static site to `dist/`.

## Launch a new brand

1. **Copy the template.** Create a new repository from this one (or clone it) and name it after the brand.
2. **Edit `site.config.mjs`.** Work top to bottom:
   - `brand`, `destination`: the two constants at the top (`brand`, `destination`) feed most of the copy, the header, the hero wordmark and the footer. Also set `brand.url` (the live address), `brand.lang` and `destination.timeZone` (an IANA name such as `Europe/Lisbon`, used by the live clocks).
   - `hero`: headline, intro text, buttons and the four `startHere` links (exactly four).
   - `colors` and `fonts`: the design tokens. To change a typeface, put its `.woff2` files in `src/fonts/` and list them under the right role (`display`, `text`, `mono`).
   - `photos` and each journey's and story's `photo`: replace the placeholder Unsplash images. Write a real `alt` for each.
   - `journeys`, `panels`, `feature`, `calendar`, `stories`, `cta`: the section copy.
   - `contact` and `footer`: email, address, hours and legal links. The footer reads `© [year] [brand name]` from `brand.year` (the current year by default) and `brand.name`.
3. **Build and preview.**
   ```bash
   npm run build
   ```
   ```bash
   npm run preview
   ```
   The preview runs at http://localhost:4173. The build stops with a list of problems if a required field is missing, a colour isn't a hex value, a font file can't be found or the time zone isn't valid.
4. **Check phones.** With Playwright installed, this loads the page at widths from 320px to 768px, with the menu open and closed, and fails if anything can scroll sideways:
   ```bash
   npm run check:mobile
   ```
5. **Deploy.** Point Vercel (or any static host) at the repository. `vercel.json` already sets the build command (`npm run build`) and the output folder (`dist`).

## Writing copy

- Wrap words in `*asterisks*` to set them in the italic display face, e.g. `heading: 'Six journeys, *taken slowly*'`.
- Section labels are numbered automatically: (01), (02) and so on.
- Links can point at sections on the page (`#journeys`, `#plan`, `#table`, `#when`, `#stories`, `#contact`) or at your own pages.
- The giant hero wordmark is sized for a name of about nine letters. Longer names scale down automatically so they always fit; on small phones a very long name is shortened with an ellipsis in the header bar.

## Files

| Path | What it is |
| --- | --- |
| `site.config.mjs` | All brand content and design tokens. The only file you need to edit. |
| `build.mjs` | Renders the page, generates the colour and font tokens, favicon and meta tags, and writes `dist/`. |
| `src/site.css` | Layout, type and motion. Uses tokens only (`var(--accent)`, `var(--font-display)` and so on), never raw brand values. |
| `src/js/` | Header and menu behaviour, scroll reveals, the live destination clock and the current-month highlight. |
| `src/fonts/` | Self-hosted web fonts. |
| `scripts/` | Local preview server and the phone-width check. |

## Fonts

The default typefaces are Instrument Serif, Inter Tight and IBM Plex Mono, all released under the SIL Open Font License 1.1, which allows self-hosting and redistribution.
