# East Meridian — 东方子午线

**Business services in China for entrepreneurs from Russia and Kazakhstan.**

A premium single-page website for East Meridian — a logistics and consulting company headquartered in Guangzhou, China, with offices in Moscow and Almaty. Operating since 2018, the company provides end-to-end services for businesses importing from China.

> Built entirely in VS Code with [Claude Code](https://claude.ai/code).

---

## Live Site

**https://east-meridian.vercel.app**

---

## Services

- **Logistics** — Air, rail, and sea freight delivery
- **Warehouse operations** — Storage, consolidation, quality inspection
- **Financial operations** — Secure payment processing with Chinese suppliers
- **Supplier sourcing** — Factory verification, price negotiation, samples
- **Trademark registration** — Brand protection in Chinese jurisdiction
- **Translation & interpreting** — Business meetings, document translation, on-site support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Custom CSS3 with design tokens (CSS variables) |
| Animation | GSAP 3.12 — ScrollTrigger, TextPlugin |
| Data visualization | D3.js v7 + TopoJSON |
| Particle system | Canvas 2D API |
| Typography | Cormorant Garamond + Inter (Google Fonts) |
| Deployment | Vercel (zero-config static) |

No build tools, no frameworks — pure HTML/CSS/JS.

---

## Key Features

### Interactive Trade Route Map
A D3.js-powered SVG map visualizing East Meridian's logistics network across China, Russia, and Kazakhstan. Features include:
- Mercator projection centered on Central Asia
- Animated dashed trade routes connecting 11+ cities
- Pulsing hub markers with SVG glow filters (`feGaussianBlur` + `feMerge`)
- City labels with Chinese characters
- Distinct country highlighting (gold for China, beige for Russia/Kazakhstan)
- Local TopoJSON data (`countries-110m.json`) for reliable offline rendering

### Canvas Particle Network
A 60-particle system rendered on `<canvas>` in the hero section. Particles drift freely and form connection lines when within proximity (130px threshold). Runs at 60fps via `requestAnimationFrame`.

### GSAP Animation System
- **Preloader** — SVG stroke-dashoffset animation with staggered text reveal
- **Hero timeline** — Orchestrated entrance of title, tagline, stats, and CTA
- **Counter animation** — Animated number counters (500+ clients, 7 years, 10,000+ shipments)
- **Scroll-triggered sections** — Fade/slide entrances synced to scroll position
- **Process timeline** — Vertical progress line that grows with scroll (`scrub: true`)
- **Mouse parallax** — Hero orbs respond to cursor movement
- **3D card tilt** — Perspective rotation on about section cards

### Design System
Dark luxury aesthetic with a gold accent palette:
```
--bg:      #060912     (deep navy)
--gold:    #d4a843     (primary accent)
--gold-lt: #f0c96a     (highlight)
--text:    #f0ede6     (off-white)
```
Glassmorphism navigation, subtle borders with `rgba` gold, and responsive `clamp()` typography.

### Responsive Layout
Full breakpoint system from desktop (3-column grids) to mobile (single column with hamburger nav and slide-out drawer). Map is hidden on small screens; all animations remain performant.

---

## Project Structure

```
East-Meridian/
├── index.html              # Single-page site (729 lines)
├── css/
│   └── style.css           # Design system + all styles (1,327 lines)
├── js/
│   └── main.js             # Animations, map, particles, interactions (1,047 lines)
├── pictures/
│   ├── 1.jpg               # About section imagery
│   ├── 3.jpg
│   └── 4.jpg
├── countries-110m.json     # TopoJSON world map data
└── README.md
```

---

## Running Locally

No dependencies to install. Open `index.html` in a browser, or use any static server:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

---

## Author

**kostanian** — [github.com/kostanian](https://github.com/kostanian)

---

<sub>Built with Claude Code in VS Code. No frameworks were harmed in the making of this website.</sub>
