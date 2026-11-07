// ─────────────────────────────────────────────────────────────────────────────
//  Postcard · site configuration
//
//  Everything brand-specific lives in this one file. Edit it, run `npm run build`,
//  and deploy the `dist/` folder. Nothing else needs to change to launch a brand.
//
//  Text conventions
//  • Wrap words in *asterisks* to set them in the italic display face (<em>).
//  • Links can be in-page anchors (#journeys) or paths to your own pages.
//  • Photos: `src` is a full image URL. Unsplash URLs get responsive srcsets
//    automatically; any other URL is used as-is. `bg` is the colour shown while
//    the photo loads; `alt` describes the photo for screen readers.
// ─────────────────────────────────────────────────────────────────────────────

const brand = 'Brand name';          // Shown in the header, the giant hero wordmark and the footer.
const destination = 'Destination';   // The place you sell, e.g. a country, region or island group.

export default {
  // ── Brand ────────────────────────────────────────────────────────────────
  brand: {
    name: brand,
    tagline: `Slow travel in ${destination}`, // Used in the page <title>: "Brand name · tagline"
    description: `Slow, unhurried travel in ${destination}, planned for curious adults who want to travel like locals.`,
    url: 'https://example.com',       // Live address of the site, no trailing slash. Used for canonical and social tags.
    lang: 'en',                       // Language of the page (BCP 47 code).
    year: new Date().getFullYear(),   // Footer reads "© [year] [brand name]". Set a fixed number if you prefer.
    // Favicon: a rounded square with the first letter of the brand name.
    // Override the letter here, or set `favicon.file` to the path of your own SVG.
    favicon: { letter: brand.trim().charAt(0).toUpperCase(), file: '' },
  },

  // ── Destination ──────────────────────────────────────────────────────────
  destination: {
    name: destination,
    timeZone: 'UTC', // IANA time zone of the destination, e.g. 'Europe/Lisbon'. Drives the live clocks.
  },

  // ── Colours ──────────────────────────────────────────────────────────────
  // Every colour on the site comes from these tokens.
  colors: {
    accent: '#B5512B',          // Hover colour on links and lines; favicon background.
    accentDeep: '#8E3A1B',      // Section numbers, index subtitles, focus rings on light backgrounds.
    secondary: '#535B2E',       // Footer background.
    secondarySoft: '#DCDDC4',
    highlight: '#C9952F',       // Hero link underline, enquiry button, numbers on dark panels.
    highlightSoft: '#F2E3BF',   // Footer accents and button hover.
    paper: '#FBF8F2',           // Page background and light text on photos.
    tint: '#F1E9DC',            // Alternate section background.
    deep: '#13324B',            // Dark section background (the three panels).
    deepSoft: '#DCE5EC',
    ink: '#241E19',             // Body text.
    inkSoft: '#5A4F45',         // Secondary text.
  },

  // ── Fonts ────────────────────────────────────────────────────────────────
  // Three roles. Put .woff2 files in src/fonts/ and list them here; `subset` is
  // 'latin' or 'latin-ext' (sets the unicode-range) or '' for the whole file.
  // `preload: true` on the one or two files the first screen needs.
  fonts: {
    display: {
      family: 'Instrument Serif',
      fallback: "'Iowan Old Style', Georgia, serif",
      files: [
        { file: 'instrument-serif-normal-400-latin.woff2', style: 'normal', weight: '400', subset: 'latin', preload: true },
        { file: 'instrument-serif-normal-400-latin-ext.woff2', style: 'normal', weight: '400', subset: 'latin-ext' },
        { file: 'instrument-serif-italic-400-latin.woff2', style: 'italic', weight: '400', subset: 'latin' },
        { file: 'instrument-serif-italic-400-latin-ext.woff2', style: 'italic', weight: '400', subset: 'latin-ext' },
      ],
    },
    text: {
      family: 'Inter Tight',
      fallback: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      files: [
        { file: 'inter-tight-normal-400-600-latin.woff2', style: 'normal', weight: '400 600', subset: 'latin', preload: true },
        { file: 'inter-tight-normal-400-600-latin-ext.woff2', style: 'normal', weight: '400 600', subset: 'latin-ext' },
      ],
    },
    mono: {
      family: 'IBM Plex Mono',
      fallback: 'ui-monospace, Menlo, monospace',
      files: [
        { file: 'ibm-plex-mono-normal-400-latin.woff2', style: 'normal', weight: '400', subset: 'latin' },
        { file: 'ibm-plex-mono-normal-400-latin-ext.woff2', style: 'normal', weight: '400', subset: 'latin-ext' },
        { file: 'ibm-plex-mono-normal-500-latin.woff2', style: 'normal', weight: '500', subset: 'latin' },
        { file: 'ibm-plex-mono-normal-500-latin-ext.woff2', style: 'normal', weight: '500', subset: 'latin-ext' },
      ],
    },
  },

  // ── Photos ───────────────────────────────────────────────────────────────
  // Placeholder photography from Unsplash. Replace with your own.
  photos: {
    hero: { src: 'https://images.unsplash.com/photo-1767022072294-bcbf51e5cf89?ixlib=rb-4.1.0', alt: 'White houses and a church tower spilling down a hillside above olive groves', bg: '#d9c0a6' },
    social: '', // Image for link previews (1200×630). Leave empty to use the hero photo.
    feature: { src: 'https://images.unsplash.com/photo-1682313014568-2ed4f520e020?ixlib=rb-4.1.0', alt: 'Grilled octopus with diced peppers on a white plate', bg: '#f3d9c0' },
    cta: { src: 'https://images.unsplash.com/photo-1655307544022-85ae3a6d5ae7?ixlib=rb-4.1.0', alt: 'Cathedral domes rising above a sea wall', bg: '#40738c' },
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  // Desktop: `left` and `right` sit either side of the centred brand name.
  // Mobile: both lists, then the call to action, appear in the menu.
  nav: {
    left: [
      { label: 'Journeys', href: '#journeys' },
      { label: 'Plan', href: '#plan' },
      { label: 'At the table', href: '#table' },
    ],
    right: [
      { label: 'When to go', href: '#when' },
      { label: 'Stories', href: '#stories' },
    ],
    cta: { label: 'Plan a trip', href: '#contact' },
    // Optional language switcher, e.g. [{ code: 'en', label: 'EN', href: '/', current: true }, { code: 'fr', label: 'FR', href: '/fr/' }]
    languages: [],
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    headline: `Travel ${destination} at the pace of a long lunch.`,
    dek: 'Food, small towns, rail journeys and festivals, planned for curious adults who would rather stay three nights than three hours.',
    buttons: [
      { label: 'Plan a trip', href: '#contact', style: 'light' },
      { label: 'The journeys', href: '#journeys', style: 'line' },
    ],
    // The four numbered "start here" links along the bottom of the hero.
    startHere: [
      { title: 'Signature journeys', text: 'Routes we know by heart', href: '#journeys' },
      { title: 'Local time', text: 'When the place eats, rests and goes out', href: '#plan' },
      { title: 'At the table', text: 'Markets, kitchens and long lunches', href: '#table' },
      { title: 'When to go', text: 'The year, month by month', href: '#when' },
    ],
  },

  // ── (01) The idea ────────────────────────────────────────────────────────
  idea: {
    label: 'The idea',
    statement: { lead: `${destination} is best taken slowly.`, em: 'Fewer bases, longer lunches,', soft: 'trains instead of motorways, dinner when the locals eat and a village festival you didn’t know existed.' },
    body: `Most trips to ${destination} are fast: a few cities, a few days each and a list of sights. We plan the other kind, with time to sit, talk and stay a little longer than you meant to.`,
    facts: [
      { value: '6', text: 'signature journeys, each built around one place and its pace' },
      { value: '12', text: 'months in our calendar, with what is worth the trip' },
    ],
  },

  // ── (02) Journeys ────────────────────────────────────────────────────────
  // The numbered index list. Also listed in the first footer column.
  journeys: {
    id: 'journeys',
    label: 'Journeys',
    heading: 'Six journeys, *taken slowly*',
    all: { label: 'All journeys', href: '#journeys' },
    footerHeading: 'Journeys',
    items: [
      { name: 'Journey one', subtitle: '8 nights · Food', text: 'Old bodegas, white hill towns and long lunches, best taken slowly and out of the summer heat.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1686291901440-ca7c418ea5c2?ixlib=rb-4.1.0', alt: 'Brick arches and a tiled tower around a grand square', bg: '#260c0c' } },
      { name: 'Journey two', subtitle: '7 nights · Coast', text: 'Small bars, cider houses and fishing towns on a green coast, where eating well is taken seriously.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1619337491481-de0b69b2050d?ixlib=rb-4.1.0', alt: 'A curved bay seen from a green headland, with the city and hills behind', bg: '#738c8c' } },
      { name: 'Journey three', subtitle: '10 nights · Rail', text: 'Estuaries, granite villages and the best seafood on the coast, linked by fast trains.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1646521976970-1e9620f60f59?ixlib=rb-4.1.0', alt: 'Fishing boats in a small harbour lined with tall, pastel-coloured houses', bg: '#0c73d9' } },
      { name: 'Journey four', subtitle: '6 nights · Towns', text: 'A medieval old town, stone villages and local wine, an hour or two from the city.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1544368885-24a56d4a3c2d?ixlib=rb-4.1.0', alt: 'Colourful riverside houses reflected in still water', bg: '#262626' } },
      { name: 'Journey five', subtitle: '9 nights · Countryside', text: 'Walled cities, slow-roasted lunches and quiet wine country on a high plateau.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1609055126911-64b3f3b6997f?ixlib=rb-4.1.0', alt: 'Café tables under the stone arcades of a vast, golden square', bg: '#c0c0c0' } },
      { name: 'Journey six', subtitle: '8 nights · Islands', text: 'Mountain villages, island food and an old wooden train, best in spring and autumn.', href: '#contact',
        photo: { src: 'https://images.unsplash.com/photo-1608126314258-920529518f20?ixlib=rb-4.1.0', alt: 'Steep green cliffs dropping into deep blue sea', bg: '#738cc0' } },
    ],
  },

  // ── (03) Plan like a local: three panels on the dark band ────────────────
  // A panel with `clock: true` shows the live time at the destination.
  panels: {
    id: 'plan',
    label: 'Plan like a local',
    heading: `Three ways to *travel at ${destination} speed*`,
    items: [
      { clock: true, clockLabel: `in ${destination} now`, title: 'Local time', text: 'When the place eats, rests and goes out, so you never arrive at an empty restaurant.', link: { label: 'Plan around it', href: '#contact' } },
      { value: '6', valueLabel: 'journeys to start from', title: 'Signature journeys', text: 'Pick a journey and we shape it around you: the pace, the stays and the nights in each place.', link: { label: 'See the journeys', href: '#journeys' } },
      { value: '12', valueLabel: 'months, all worth it', title: 'When to go', text: 'What each month is good for, from markets and harvests to the festivals worth the trip.', link: { label: 'See the calendar', href: '#when' } },
    ],
  },

  // ── (04) Feature: photo and text side by side ────────────────────────────
  feature: {
    id: 'table',
    label: 'At the table',
    heading: 'Eat late, eat locally, *and linger.*',
    text: 'Food here is regional first and national second. We plan around the market in the morning, a long lunch and the right bar for the right hour, and the talk at the table afterwards, when nobody is in a hurry to leave.',
    button: { label: 'Ask about food trips', href: '#contact' },
  },

  // ── (05) When: twelve-month calendar (the current month is highlighted) ──
  calendar: {
    id: 'when',
    label: 'When',
    heading: 'A year of *reasons to go*',
    all: { label: 'Ask about dates', href: '#contact' },
    months: [
      { note: 'Winter', highlight: 'Quiet cities and winter markets' },
      { note: 'Winter', highlight: 'Carnival season' },
      { note: 'Spring', highlight: 'Blossom in the valleys' },
      { note: 'Spring', highlight: 'Spring fairs and processions' },
      { note: 'Spring', highlight: 'Courtyards in flower' },
      { note: 'Summer', highlight: 'Midsummer bonfires on the beach' },
      { note: 'Summer', highlight: 'Open-air theatre at night' },
      { note: 'Summer', highlight: 'Wine and seafood festivals' },
      { note: 'Autumn', highlight: 'The grape harvest' },
      { note: 'Autumn', highlight: 'Mushrooms and mountain walks' },
      { note: 'Autumn', highlight: 'Chestnuts and new wine' },
      { note: 'Winter', highlight: 'Christmas markets' },
    ],
    href: '#contact', // Where each month links to.
  },

  // ── (06) Stories: three cards ────────────────────────────────────────────
  stories: {
    id: 'stories',
    label: 'Stories',
    heading: 'Notes from *the road*',
    all: { label: 'All stories', href: '#stories' },
    items: [
      { tag: 'Food', date: '2026-09-14', title: 'Dinner late: a field guide to local hours', text: 'Why the restaurant was empty at seven, and how to change your day so it isn’t.', href: '#stories',
        photo: { src: 'https://images.unsplash.com/photo-1780639026821-f680fae0d99d?ixlib=rb-4.1.0', alt: 'A crowded, warmly lit bar with a chalkboard menu and hams overhead', bg: '#26260c' } },
      { tag: 'Wine', date: '2026-08-02', title: 'Three glasses of local wine', text: 'A short, practical guide to what to order and where.', href: '#stories',
        photo: { src: 'https://images.unsplash.com/photo-1457280468258-28589fb67a93?ixlib=rb-4.1.0', alt: 'Bunches of green grapes ripening on the vine', bg: '#0c4026' } },
      { tag: 'Rail', date: '2026-06-20', title: 'The fast train to the slow coast', text: 'How a new rail line changed the way we plan trips to the far corner of the map.', href: '#stories',
        photo: { src: 'https://images.unsplash.com/photo-1689027050682-a347aa3739b7?ixlib=rb-4.1.0', alt: 'Long fingers of rock running into the ocean at sunset', bg: '#262626' } },
    ],
  },

  // ── Closing call to action on a photo ────────────────────────────────────
  cta: {
    id: 'contact',
    label: 'Plan with us',
    heading: 'Pull up a chair.',
    text: `Tell us how you like to travel, and we will suggest a slow route through the ${destination} you want to see. No obligation; we reply personally.`,
    buttons: [
      { label: 'Start an enquiry', href: 'mailto:hello@example.com', style: 'highlight' },
      { label: 'See the journeys', href: '#journeys', style: 'line' },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    email: 'hello@example.com',
    phone: '',                                       // Optional, e.g. '+00 000 000 000'
    address: ['Street address', 'Postcode City', 'Country'], // One line per entry. Leave [] to hide.
    hours: 'Monday to Friday, 9:00 to 17:00 (local time)',
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    title: 'Stay for *the long lunch.*',
    text: 'We plan trips at the pace of the table after a good meal, when nobody is in a hurry to leave.',
    button: { label: 'Plan a trip', href: '#contact' },
    clockLabel: `${destination} time`,
    planHeading: 'Plan',
    contactHeading: 'Contact',
    note: 'Dates, times and opening hours are a guide only. Please check them before you travel.',
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Booking Terms', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },

  // ── Structured data (schema.org) ─────────────────────────────────────────
  schemaType: 'TravelAgency',
};
