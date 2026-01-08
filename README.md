# Guillem Vila — Studio Website + Open Learning Resources

This repository contains the Nuxt-based website for **Guillem Vila** and an open, community-driven learning section:

- **/resources**: articles and learning materials
- **/resources/roadmap**: interactive learning roadmap (graph)

The goal is to build a high-quality, well-structured learning path for music production, recording, editing, mixing, sound design, harmony and music theory — maintained with the community (Wikipedia-style, via Pull Requests).

---

## Tech stack

- Nuxt (app in `/app`)
- Nuxt Content (articles in `/content`)
- Roadmap data served from `/public/roadmap.json`
- Deployed on Vercel

---

## Local development

Requirements:

- Node.js
- npm

Install & run:

```bash
npm install
npm run dev
```

App runs at:

- http://localhost:3000

---

## Project structure

- `app/` — Nuxt app (pages, components)
- `content/` — articles (Nuxt Content)
- `public/roadmap.json` — roadmap nodes/edges used by the interactive map
- `app/pages/resources/` — resources hub, category pages, article pages

Articles live under:

- `content/resources/<category>/<id>-<slug>.md`

Example:

- `content/resources/mixing/me-12-headroom-mix-bus.md`

---

## Scripts (roadmap & resources)

These scripts live in `./scripts/`.

### 1) Generate `data/roadmap.json` from the Excel

```bash
node ./scripts/generate-roadmap-json.mjs
```

### 2) Generate/update scaffolded content under `content/resources/**`

```bash
node ./scripts/scaffold-roadmap-content.mjs
```

### 3) Sync the roadmap into `public/roadmap.json` (so the frontend can load it)

```bash
node ./scripts/sync-roadmap-public.mjs
```

### Run everything (recommended)

```bash
node ./scripts/generate-roadmap-json.mjs && node ./scripts/scaffold-roadmap-content.mjs && node ./scripts/sync-roadmap-public.mjs
```

---

## Contributing (Wikipedia-style)

Contributions are welcome via Pull Requests.

Please read **CONTRIBUTING.md** before submitting changes.

Quick workflow:

1. Fork this repository
2. Create a branch
3. Add or edit content
4. Open a Pull Request
5. Maintainers review and merge (or request changes)

---

## Licensing

- **Code**: MIT (see `LICENSE`)
- **Content (articles/resources)**: CC BY-SA 4.0 (see `LICENSE-CONTENT`)
