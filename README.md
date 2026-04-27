# Portfolio 2026 — Mel Sabrina Pesce Ortiz

Interactive node-tree portfolio. React + TypeScript + Vite. Bilingual EN/ES. Dark/light theme. Responsive — desktop canvas + mobile list view.

## Concept

The UI is a navigable node graph — not a linear portfolio. A root node (profile) branches into three work domains. Clicking a project node opens content panels with demos, screenshots, and context. One branch open at a time.

## Projects showcased

**Interfaces**
- **SaludENT** — Angular + Ionic clinical reference app for 12 national health programs. Fully embedded interactive demo with custom cursor relay, momentum scroll, horizontal table drag, and bottom sheets.
- **VisitAPS** — PWA for field health agents (Ministerio de Salud). Embedded demo with role-based mock login.

**Editorial**
- **Clinical Pathways** — Modular graphic system for Argentina's national clinical pathways (MSAL + PAHO). Image gallery node.
- **Selected Manuals 2023** — Editorial documents for DNAIENT. Three image carousel nodes (Cardio·Bucal, Fluor, Promotores).
- **Digital Health Strategy 2025** — Visual identity for federal health summit. Image gallery + video node.
- **Las Variaciones Rosas** — Book / essay. In progress.
- **Paseo Lourdes** — Brand identity. In progress.

**Otros**
- **Bilos** — Real-time AI visualizers (Stable Diffusion + Unreal Engine 5). Dual-track video nodes.
- **Acostactics** — Computer vision + ML. In progress.

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

## Mobile

Below 768px, the canvas switches to a dedicated mobile view: profile card with avatar, branch accordion, inline project expansion with image gallery, description, tags, and action buttons.

## Notes

- `public/videos/horiz_1080.mp4` and `public/videos/habitaciones_traseras.mp4` are excluded from git (exceed GitHub's 100MB limit). Add them back locally if needed.
- `public/saludent-demo/` and `public/visitaps-demo/` are pre-built static deployments embedded as iframes.
- Custom cursor is desktop-only — disabled on touch devices via media query and JS guard.
