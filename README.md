# Mursal Hajiyev — Portfolio

Dark, futuristic, interactive 3D portfolio. Vite + Three.js + GSAP/ScrollTrigger + Lenis.
Deploys as a static site to GitHub Pages at `/newprojectforportfolio/`.

## Stack

- **Vite** — dev server + production bundling
- **Three.js** — hero scene (drag-rotatable shapes) + particle background
- **GSAP + ScrollTrigger** — scroll-driven reveals
- **Lenis** — buttery smooth scrolling
- **Vanilla JS modules** — no framework overhead

## Editing content

All copy, projects, experience, skills, education, certificates, languages, and
links live in **`src/data/content.js`**. Edit that file — no HTML changes needed.

Main portfolio content can be updated in `src/data/content.js`.

This includes:
- profile text
- links
- about section
- featured projects
- experience
- skills
- education
- certificates
- languages

## Run locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173/newprojectforportfolio/`.

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Preview production build

```bash
npm run preview
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

This runs `vite build` and pushes `dist/` to the `gh-pages` branch via the
`gh-pages` package. The live URL is:

`https://cartix09.github.io/newprojectforportfolio/`

> The `base: '/newprojectforportfolio/'` in `vite.config.js` must match the
> repository name. If you rename the repo, update that value.

## Project layout

```
index.html            # shell with empty section containers
src/
  main.js             # entry — boots scenes, scroll, cursor, content
  data/content.js     # ALL editable content
  styles/main.css     # theme + components + reveal animations
  three/
    hero-scene.js     # drag-rotatable 3D cluster
    background-scene.js # particle starfield
  modules/
    cursor.js         # custom cursor
    tilt.js           # project card 3D tilt
    scroll.js         # Lenis + ScrollTrigger
    nav.js            # mobile nav + smooth anchors
    render-content.js # injects content from data/content.js
vite.config.js
```

## Performance & accessibility notes

- `prefers-reduced-motion` disables the particle drift, hero auto-rotation,
  and reveal transitions; the cursor and tilt modules degrade gracefully.
- Custom cursor and tilt are auto-disabled on touch / coarse-pointer devices.
- Background particle count drops on small viewports.
- Pixel ratio is capped at 2× (hero) and 1.5× (background) for laptop GPUs.
- Three.js is the heaviest dep (~600KB unminified / ~177KB gzipped). Acceptable
  for a 3D portfolio.
