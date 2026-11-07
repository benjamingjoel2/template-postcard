// Builds the Postcard template into dist/ from site.config.mjs. No dependencies.
import { mkdir, readFile, writeFile, copyFile, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const configPath = process.env.SITE_CONFIG ? join(process.cwd(), process.env.SITE_CONFIG) : join(root, 'site.config.mjs');
const { default: c } = await import(pathToFileURL(configPath).href);
const out = join(root, 'dist');
const src = join(root, 'src');

// ── Validation ───────────────────────────────────────────────────────────────
const errors = [];
const need = (cond, msg) => { if (!cond) errors.push(msg); };
need(c.brand?.name, 'brand.name is required');
need(c.destination?.name, 'destination.name is required');
need(c.hero?.headline, 'hero.headline is required');
need(Array.isArray(c.hero?.startHere) && c.hero.startHere.length === 4, 'hero.startHere needs exactly four links');
need(c.photos?.hero?.src, 'photos.hero.src is required');
need(c.contact?.email, 'contact.email is required');
for (const [k, v] of Object.entries(c.colors || {})) need(/^#[0-9a-f]{3,8}$/i.test(v), `colors.${k} must be a hex colour`);
for (const role of ['display', 'text', 'mono']) {
  for (const f of c.fonts?.[role]?.files || []) need(existsSync(join(src, 'fonts', f.file)), `fonts.${role}: src/fonts/${f.file} not found`);
}
if (c.destination?.timeZone) {
  try { new Intl.DateTimeFormat('en', { timeZone: c.destination.timeZone }); } catch { errors.push(`destination.timeZone "${c.destination.timeZone}" is not a valid IANA time zone`); }
}
if (errors.length) { console.error('site.config.mjs has problems:\n  - ' + errors.join('\n  - ')); process.exit(1); }

// ── Helpers ──────────────────────────────────────────────────────────────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rich = (s = '') => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const pad2 = (n) => String(n).padStart(2, '0');
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
const attrId = (id) => (id ? ` id="${esc(id)}"` : '');

const isUnsplash = (u) => /^https:\/\/images\.unsplash\.com\//.test(u);
function sized(u, w, ratio) {
  if (!isUnsplash(u)) return u;
  const h = ratio ? `&h=${Math.round(w / ratio)}&fit=crop` : '';
  return `${u}${u.includes('?') ? '&' : '?'}w=${w}${h}&auto=format&q=70`;
}
function img(photo, { widths, sizes, ratio, w = 1200, h = 900, eager = false }) {
  const s = photo.src;
  const srcset = isUnsplash(s) ? ` srcset="${esc(widths.map((x) => `${sized(s, x, ratio)} ${x}w`).join(', '))}" sizes="${esc(sizes)}"` : '';
  const loading = eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  const bg = photo.bg ? ` style="background:${esc(photo.bg)}"` : '';
  return `<img src="${esc(sized(s, widths[widths.length - 1] >= 1200 ? 1200 : widths[widths.length - 1], ratio))}"${srcset} width="${w}" height="${h}" alt="${esc(photo.alt || '')}"${loading}${bg}>`;
}
const btn = (b) => `<a class="btn btn--${esc(b.style || 'solid')}" href="${esc(b.href)}"><span>${esc(b.label)}</span></a>`;
const linkArrow = (l) => (l ? `<a class="link-arrow" href="${esc(l.href)}">${esc(l.label)}${arrow}</a>` : '');

let sectionNo = 0;
const label = (text) => `<p class="label"><b>(${pad2(++sectionNo)})</b>${esc(text)}</p>`;

// ── Fonts & tokens ───────────────────────────────────────────────────────────
const RANGES = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF',
};
const fontRoles = ['display', 'text', 'mono'];
const fontFaces = fontRoles.flatMap((r) => (c.fonts[r].files || []).map((f) =>
  `@font-face {font-family: '${c.fonts[r].family}';font-style: ${f.style || 'normal'};font-weight: ${f.weight || '400'};font-display: swap;src: url(/assets/fonts/${f.file}) format('woff2');${f.subset ? `unicode-range: ${RANGES[f.subset]};` : ''}}`)).join('');
const fontPreloads = fontRoles.flatMap((r) => (c.fonts[r].files || []).filter((f) => f.preload)
  .map((f) => `<link rel="preload" href="/assets/fonts/${f.file}" as="font" type="font/woff2" crossorigin>`)).join('');
const tokens = `:root {\n${Object.entries(c.colors).map(([k, v]) => `  --${kebab(k)}: ${v};`).join('\n')}\n${fontRoles.map((r) => `  --font-${r}: '${c.fonts[r].family}', ${c.fonts[r].fallback};`).join('\n')}\n}\n`;

// The giant wordmark is tuned for a ~9-letter name; longer names scale down so they always fit.
const wordmarkScale = Math.min(1, 9 / Math.max(1, [...c.brand.name].length));

// ── Page ─────────────────────────────────────────────────────────────────────
const B = c.brand, D = c.destination, P = c.photos;
const title = `${B.name} · ${B.tagline}`;
const pageUrl = `${B.url.replace(/\/$/, '')}/`;
const socialImage = P.social || sized(P.hero.src, 1200, 1200 / 630);
const navAll = [...c.nav.left, ...c.nav.right];
const langs = (cls) => (c.nav.languages?.length
  ? `<nav class="langs ${cls}" aria-label="Language">${c.nav.languages.map((l) => `<a href="${esc(l.href)}" hreflang="${esc(l.code)}" lang="${esc(l.code)}"${l.current ? ' aria-current="true"' : ''}>${esc(l.label)}</a>`).join('<span aria-hidden="true">·</span>')}</nav>`
  : '');
const navList = (items) => items.map((i) => `<li><a href="${esc(i.href)}">${esc(i.label)}</a></li>`).join('');

const ld = {
  '@context': 'https://schema.org', '@type': c.schemaType || 'Organization', name: B.name, description: B.description, url: pageUrl, email: c.contact.email,
  ...(c.contact.phone ? { telephone: c.contact.phone } : {}),
};
const heroWidths = [480, 800, 1200, 1600, 2200];

const head = `<!doctype html>
<html lang="${esc(B.lang)}" class="no-js" data-tz="${esc(D.timeZone || '')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(B.description)}">
<link rel="canonical" href="${esc(pageUrl)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(B.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:image" content="${esc(socialImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${esc(c.colors.paper)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${isUnsplash(P.hero.src) ? '<link rel="preconnect" href="https://images.unsplash.com">\n' : ''}<link rel="preload" as="image" ${isUnsplash(P.hero.src) ? `imagesrcset="${esc(heroWidths.map((x) => `${sized(P.hero.src, x)} ${x}w`).join(', '))}" imagesizes="100vw"` : `href="${esc(P.hero.src)}"`} fetchpriority="high">
${fontPreloads}
<style>${fontFaces}</style>
<link rel="stylesheet" href="/assets/site.css?v=__V__">
<script>document.documentElement.className='js'</script>
</head>`;

const header = `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="site-header">
  <div class="container header-inner">
    <a class="wordmark" href="/" aria-label="${esc(B.name)}, home">${esc(B.name)}</a>
    <ul class="nav-group nav-left">${navList(c.nav.left)}</ul>
    <ul class="nav-group nav-right">${navList(c.nav.right)}${langs('header-langs') ? `<li>${langs('header-langs')}</li>` : ''}<li class="nav-cta"><a class="btn" href="${esc(c.nav.cta.href)}"><span>${esc(c.nav.cta.label)}</span></a></li></ul>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="bars" aria-hidden="true"></span><span class="menu-label">Menu</span></button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Main">
  <ol>${navList([...navAll, c.nav.cta])}</ol>
  ${langs('menu-langs')}
  <p class="menu-contact"><a href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a></p>
</nav>`;

const H = c.hero;
const hero = `<section class="hero on-image">
  <div class="hero-media">${img(P.hero, { widths: heroWidths, sizes: '100vw', w: 1200, h: 800, eager: true })}</div>
  <div class="container hero-inner">
    <div class="hero-top">
      <h1 class="hero-title">${rich(H.headline)}</h1>
      <div>
        <p class="hero-dek">${rich(H.dek)}</p>
        <div class="btn-row">${H.buttons.map(btn).join('')}</div>
      </div>
    </div>
    <p class="hero-wordmark" aria-hidden="true"${wordmarkScale < 1 ? ` style="--wordmark-scale:${wordmarkScale.toFixed(3)}"` : ''}>${esc(B.name)}</p>
    <nav class="hero-index" aria-label="Start here"><ul>
${H.startHere.map((s, i) => `      <li><a href="${esc(s.href)}"><span class="num">(${pad2(i + 1)})</span><strong>${esc(s.title)}</strong><span class="d">${esc(s.text)}</span></a></li>`).join('\n')}
    </ul></nav>
  </div>
</section>`;

const I = c.idea;
const idea = `<section class="section"${attrId(I.id)}>
  <div class="container row">
    <div class="row-label">${label(I.label)}</div>
    <div class="reveal">
      <p class="statement">${rich(I.statement.lead)} <em>${rich(I.statement.em)}</em> <span class="soft">${rich(I.statement.soft)}</span></p>
      <div class="grid g2" style="margin-top:clamp(2.5rem,5vw,4rem)">
        <p class="muted">${rich(I.body)}</p>
        <div class="facts" style="grid-template-columns:1fr 1fr;border-top:0">
${I.facts.map((f) => `          <div style="padding-top:0"><p class="h2" style="font-size:3.5rem">${esc(f.value)}</p><p class="muted small">${esc(f.text)}</p></div>`).join('\n')}
        </div>
      </div>
    </div>
  </div>
</section>`;

const headRow = (s) => `<div class="row" style="margin-bottom:2.5rem">
      <div class="row-label">${label(s.label)}</div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem"><h2 class="h2 reveal">${rich(s.heading)}</h2>${linkArrow(s.all)}</div>
    </div>`;

const J = c.journeys;
const journeys = `<section class="section tint"${attrId(J.id)}>
  <div class="container">
    ${headRow(J)}
    <ul class="index">
${J.items.map((j, i) => `      <li><a href="${esc(j.href)}"><span class="num">${pad2(i + 1)}</span><span class="name">${esc(j.name)}</span><span class="meta"><span class="local">${esc(j.subtitle)}</span>${esc(j.text)}</span><span class="thumb">${img(j.photo, { widths: [200, 400], sizes: '9rem', ratio: 4 / 3 })}</span></a></li>`).join('\n')}
    </ul>
  </div>
</section>`;

const PN = c.panels;
const panels = `<section class="section dark"${attrId(PN.id)}>
  <div class="container">
    <div class="row" style="margin-bottom:3rem">
      <div class="row-label">${label(PN.label)}</div>
      <h2 class="h2 reveal">${rich(PN.heading)}</h2>
    </div>
    <div class="grid g3">
${PN.items.map((p) => p.clock
  ? `      <div class="panel reveal">
        <div class="clock-live"><span class="big" id="home-time">--:--</span><span class="mono" style="opacity:.75">${esc(p.clockLabel)}</span></div>
        <h3 class="h3" style="margin-top:1.25rem">${esc(p.title)}</h3>
        <p>${rich(p.text)}</p>
        ${linkArrow(p.link)}
      </div>`
  : `      <div class="panel reveal">
        <span class="num">${esc(p.value)}<span class="mono" style="font-size:.75rem;margin-left:.75rem;opacity:.8">${esc(p.valueLabel)}</span></span>
        <h3 class="h3">${esc(p.title)}</h3>
        <p>${rich(p.text)}</p>
        ${linkArrow(p.link)}
      </div>`).join('\n')}
    </div>
  </div>
</section>`;

const F = c.feature;
const feature = `<section class="section"${attrId(F.id)}>
  <div class="container split split--wide">
    <figure class="reveal" style="margin:0"><div class="media ratio-43">${img(P.feature, { widths: [480, 800, 1200, 1600], sizes: '(min-width: 56rem) 55vw, 100vw', ratio: 4 / 3 })}</div></figure>
    <div class="reveal">
      ${label(F.label)}
      <h2 class="h2">${rich(F.heading)}</h2>
      <p class="lead muted" style="margin-top:1.5rem">${rich(F.text)}</p>
      <div class="btn-row" style="margin-top:2rem">${btn({ ...F.button, style: 'solid' })}</div>
    </div>
  </div>
</section>`;

const monthNames = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(B.lang, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, i, 1))));
const CAL = c.calendar;
const calendar = `<section class="section tint"${attrId(CAL.id)}>
  <div class="container">
    ${headRow(CAL)}
    <div class="months reveal" id="home-months">
      ${CAL.months.slice(0, 12).map((m, i) => `<a href="${esc(m.href || CAL.href)}" data-month="${i + 1}"><span class="mono">${pad2(i + 1)} · ${esc(m.note)}</span><span class="m">${esc(monthNames[i].charAt(0).toUpperCase() + monthNames[i].slice(1))}</span><span class="hl">${esc(m.highlight)}</span></a>`).join('')}
    </div>
  </div>
</section>`;

const fmtDate = (d) => new Intl.DateTimeFormat(B.lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z'));
const ST = c.stories;
const stories = `<section class="section"${attrId(ST.id)}>
  <div class="container">
    ${headRow(ST)}
    <div class="grid g3">
${ST.items.map((s) => `<article class="card reveal">
  <div class="card-head"><span>${esc(s.tag)}</span>${s.date ? `<time datetime="${esc(s.date)}">${esc(fmtDate(s.date))}</time>` : ''}</div>
  <div class="media ratio-43">${img(s.photo, { widths: [480, 800, 1200], sizes: '(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw', ratio: 4 / 3 })}</div>
  <h3 class="h3"><a href="${esc(s.href)}">${esc(s.title)}</a></h3>
  <p>${rich(s.text)}</p>
</article>`).join('\n')}</div>
  </div>
</section>`;

const CT = c.cta;
const cta = `<section class="cta on-image"${attrId(CT.id)}>
  <div class="hero-media">${img(P.cta, { widths: [480, 800, 1200, 1600, 2200], sizes: '100vw' })}</div>
  <div class="container cta-inner reveal">
    <p class="label">${esc(CT.label)}</p>
    <h2 class="display">${rich(CT.heading)}</h2>
    <p>${rich(CT.text)}</p>
    <div class="btn-row">${CT.buttons.map(btn).join('')}</div>
  </div>
</section>`;

const FT = c.footer, CO = c.contact;
const footer = `<footer class="site-footer">
  <div class="container">
    <div class="foot-lead">
      <div>
        <p class="foot-title">${rich(FT.title)}</p>
        <p class="foot-meaning">${rich(FT.text)}</p>
        ${btn({ ...FT.button, style: 'light' })}
      </div>
      <p class="foot-clock" aria-hidden="true"><span class="foot-clock-time" id="foot-time">--:--</span><span class="mono">${esc(FT.clockLabel)}</span></p>
    </div>
    <div class="foot-menu">
      <div><h2 class="foot-h">${esc(J.footerHeading || J.label)}</h2><ul class="foot-list">${J.items.map((j) => `<li><a href="${esc(j.href)}"><span>${esc(j.name)}</span><i aria-hidden="true"></i><small>${esc(j.subtitle)}</small></a></li>`).join('')}</ul></div>
      <div><h2 class="foot-h">${esc(FT.planHeading)}</h2><ul class="foot-list">${[...navAll, c.nav.cta].map((n, i) => `<li><a href="${esc(n.href)}"><span>${esc(n.label)}</span><i aria-hidden="true"></i><small>${pad2(i + 1)}</small></a></li>`).join('')}</ul></div>
      <div><h2 class="foot-h">${esc(FT.contactHeading)}</h2><ul class="foot-contact"><li><a href="mailto:${esc(CO.email)}">${esc(CO.email)}</a></li>${CO.phone ? `<li><a href="tel:${esc(CO.phone.replace(/[^+\d]/g, ''))}">${esc(CO.phone)}</a></li>` : ''}${CO.address?.length ? `<li>${CO.address.map(esc).join('<br>')}</li>` : ''}${CO.hours ? `<li class="small">${esc(CO.hours)}</li>` : ''}</ul></div>
    </div>
    <div class="footer-meta">
      <p>© ${esc(B.year)} <span class="foot-mark">${esc(B.name)}</span>${FT.note ? ` ${esc(FT.note)}` : ''}</p>
      ${FT.legal?.length ? `<p>${FT.legal.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(' · ')}</p>` : ''}
      <p><a href="#main">Back to top ↑</a></p>
    </div>
  </div>
</footer>`;

let html = `${head}
<body class="has-hero">
${header}
<main id="main">

${hero}

${idea}

${journeys}

${panels}

${feature}

${calendar}

${stories}

${cta}
</main>
${footer}
<script src="/assets/js/site.js?v=__V__" defer></script>
<script src="/assets/js/home.js?v=__V__" defer></script>
</body>
</html>
`;

// ── Favicon ──────────────────────────────────────────────────────────────────
const favicon = B.favicon?.file
  ? await readFile(join(root, B.favicon.file), 'utf8')
  : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${c.colors.accent}"/><text x="32" y="46" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="40" fill="${c.colors.paper}">${esc(B.favicon?.letter || B.name.charAt(0))}</text></svg>`;

// ── Write ────────────────────────────────────────────────────────────────────
const css = tokens + (await readFile(join(src, 'site.css'), 'utf8'));
const version = Date.now().toString(36);
html = html.replaceAll('__V__', version);

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets', 'js'), { recursive: true });
await mkdir(join(out, 'assets', 'fonts'), { recursive: true });
await writeFile(join(out, 'index.html'), html);
await writeFile(join(out, 'assets', 'site.css'), css);
await writeFile(join(out, 'favicon.svg'), favicon);
for (const f of await readdir(join(src, 'js'))) await copyFile(join(src, 'js', f), join(out, 'assets', 'js', f));
const usedFonts = new Set(fontRoles.flatMap((r) => (c.fonts[r].files || []).map((f) => f.file)));
for (const f of usedFonts) await copyFile(join(src, 'fonts', f), join(out, 'assets', 'fonts', f));

console.log(`Built ${B.name} → dist/ (index.html ${(html.length / 1024).toFixed(1)} kB, ${usedFonts.size} font files)`);
