# Portfolio 2026 — Mel Sabrina Pesce Ortiz

Interactive node-tree portfolio. React + TypeScript + Vite. Bilingual EN/ES.

## Concept

The UI is a navigable node graph — not a linear portfolio. A root node (profile) branches into three work domains. Clicking a project node opens content panels with demos, screenshots, and context. One branch open at a time.

## Projects showcased

- **SaludENT** — Angular + Ionic clinical reference app for 12 national health programs. Fully embedded interactive demo with custom cursor relay and momentum scroll.
- **VisitAPS** — PWA for field health agents (Ministerio de Salud). Embedded demo with role-based mock login.
- **Editorial Design** — Rutas Clínicas, epidemiological manuals, digital health strategy 2025.

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styles | Pure CSS custom properties |
| i18n | JSON string maps, EN default |
| Videos | Self-hosted MP4 (gitignored if >100MB) |
| Deploy | Vercel (static) |

## Run locally

```bash
npm install
npm run dev
```

## Notes

- `public/videos/horiz_1080.mp4` and `public/videos/habitaciones_traseras.mp4` are excluded from git (exceed GitHub's 100MB limit). Add them back locally if needed.
- `public/saludent-demo/` and `public/visitaps-demo/` are pre-built static deployments embedded as iframes.
- Custom cursor is injected into nested iframes via `postMessage` relay.
