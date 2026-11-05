# PayTrack Landing Page

Official responsive landing page for **PayTrack** — the 100% offline personal khata, debt manager, and utility bill tracking app.

## Key Features

- **Procedural 3D Phone with Three.js**: Real-time 3D interactive phone that turns and seamlessly transitions between screens as you scroll through features.
- **Scroll-Driven Animation**: Powered by GSAP, ScrollTrigger, and SplitText for silky-smooth micro-animations.
- **Smooth Inertial Scrolling**: Integrated with Lenis for premium kinetic scrolling feel.
- **100% Complete & Self-Contained**: Self-hosted custom fonts (*Gabarito* display & *Plus Jakarta Sans* body), embedded high-res WebP screenshot textures, and localized vendor libraries.
- **Responsive & Lightweight**: Optimized for both high-resolution desktop screens and mobile viewports.
- **WhatsApp Integration**: Direct ordering and licensing via WhatsApp (`923260735090`).

## File Structure

```text
landing/
├── index.html                    # Production landing page
├── favicon.svg                   # PayTrack brand favicon
├── assets/
│   ├── style.css                 # Main design stylesheet (fintech light theme)
│   ├── script.js                 # 3D canvas engine & interactive scroll script
│   ├── thumbnail.png             # Social sharing preview card
│   ├── fonts/                    # Self-hosted Gabarito & Plus Jakarta Sans
│   └── vendor/                   # Self-hosted Three.js, GSAP, Lenis, ScrollTrigger & SplitText
└── README.md                     # Documentation
```

## Running Locally

Because the landing page utilizes modern ES modules and WebGL canvas textures, it should be served via an HTTP server:

```bash
# Run from this landing directory
python -m http.server 8080 --bind 127.0.0.1
```

---
Designed and Developed by **Rehan Ayaz**

## Maintenance and release

Read `docs/CODE-STANDARDS.md` before edits. All custom classes use `pt-`. See `docs/FINAL-REPORT.md` for tested results and pending checks.

Use `release/paytrack-prelaunch.zip` as the review package. It contains only the public HTML, assets, icons, favicon, robots and sitemap. It deliberately excludes local backups, tools, audit files and hosting configurations. No deployment has been performed. Keep original backups private.

`node tools/verify.cjs` verifies class references and JavaScript syntax using the existing parent workspace development packages; it adds no website dependency.
