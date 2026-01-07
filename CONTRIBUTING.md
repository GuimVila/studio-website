# Contributing

## Workflow

1. Fork the repo
2. Create a branch
3. Commit your changes
4. Open a Pull Request

## Branch naming

Use one of these prefixes:

- `content/`
- `fix/`
- `i18n/`
- `docs/`
- `chore/`

Format:

- kebab-case only

Examples:

- `content/add-mixing-headroom-article`
- `fix/typos-harmony-module`
- `i18n/es-translation-mixing`

Recommended branch name pattern (regex):
`^(content|fix|i18n|docs|chore)\/([a-z0-9]+(?:-[a-z0-9]+)*)$`

## What you can contribute

- New articles under `content/resources/**`
- Fixes/improvements to existing articles
- Typos, clarity improvements
- Roadmap updates (only if aligned with the roadmap structure)
- Translations (when multilingual is enabled)

## Article file naming

Use:
`<id-lowercase>-<slug>.md`

Example:
`me-12-headroom-mix-bus.md`

## Frontmatter (required)

Each article must start with YAML frontmatter including:

- `id`
- `title`
- `seq`
- `categorySlug`
- `path`

Example:

```yaml
---
id: "ME-12"
title: "Headroom al mix bus"
seq: 120
categorySlug: "mixing"
path: "/resources/mixing/me-12-headroom-mix-bus"
---
```

## Content quality guidelines

- Keep it practical and structured.
- Prefer actionable steps and measurable outcomes.
- Respect prerequisites and progression (avoid random topics).
- Use consistent terminology and clear titles.
- Add examples, checklists and deliverables when possible.
