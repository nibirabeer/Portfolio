# Portfolio

My personal portfolio — a React + Vite site built around a strict black/white/gray, editorial
design language. GSAP drives the motion throughout — scroll reveals, a shuffling "riffle" project
deck, full-screen wave-curtain page transitions, and a self-drawing logo preloader — while the
Projects and Skills pages pull live from the GitHub API instead of hardcoded data, so they stay
current automatically.

**Live:** https://protfolio-ten-black.vercel.app

## Features

- **Live GitHub data** — Projects and Skills are generated from the GitHub REST API (repos,
  languages, commit recency), not static content, so they update themselves as new repos are pushed.
- **GSAP-animated throughout** — scroll-triggered reveals, a draggable/click-to-shuffle project
  deck with a staggered zigzag "riffle" animation, a DrawSVG-traced logo preloader, and a
  MorphSVG wave-curtain transition on every page navigation.
- **Monochrome glass design system** — black/white/gray palette with soft glassmorphism surfaces,
  consistent across every page.
- **Real contact flow** — a working contact form (Formspree) and booking calendar, no placeholders.
- **Responsive** — tuned down to mobile, including the animated backgrounds and project deck.

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) (hash routing)
- [GSAP](https://gsap.com/) — Draggable, InertiaPlugin, MorphSVGPlugin, DrawSVGPlugin, ScrollTrigger
- [Firebase](https://firebase.google.com/) — booking calendar backend
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
git clone https://github.com/nibirabeer/protfolio.git
cd protfolio
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command           | Description                        |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start the local dev server          |
| `npm run build`     | Production build to `dist/`         |
| `npm run preview`  | Preview the production build        |
| `npm run lint`      | Lint the codebase                   |

## Author

Built by [Nibir Abeer](https://github.com/nibirabeer) — BSc (Hons) Computer Science, University of
Bedfordshire. Get in touch: abirnibir10@gmail.com
