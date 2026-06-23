<div align="center">
  <img src="web/public/favicon.svg" width="64" height="64" alt="Yanbo Skills logo" />

  # Yanbo Skills

  A reusable skill collection and visual marketplace for AI agents.

  [中文](./README.md) | English

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-087EA4?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
</div>

---

## Overview

Yanbo Skills is an open repository of reusable skills for AI agents. Each skill includes its own `SKILL.md` and can be installed as a building block for agent workflows, AI assistants, and other compatible tools.

The repository has two main parts:

- `skills/`: independently installable skill content
- `web/`: a Next.js marketplace for browsing and installing skills

## Highlights

- Browse and install skills interactively from GitHub
- Install a specific skill by name
- Search and inspect complete skill instructions in a visual marketplace
- Copy exact installation commands with one click
- Switch between light, dark, and system themes
- Maintain portable skills with a consistent `SKILL.md` format

## Install skills

Browse and select skills interactively:

```bash
npx skills add https://github.com/yanboim/skills
```

Install a specific skill directly:

```bash
npx skills add https://github.com/yanboim/skills --skill <skill-name>
```

Example:

```bash
npx skills add https://github.com/yanboim/skills --skill industry-chain-infographic
```

Use the `name` field from the target skill's `SKILL.md` frontmatter as its installation name.

## Local development

```bash
git clone https://github.com/yanboim/skills.git
cd skills/web
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the marketplace.

Before submitting changes, run:

```bash
npm run lint
npm run build
```

## Add a new skill

1. Create a directory at `skills/<skill-name>/`.
2. Add a `SKILL.md` with valid frontmatter.
3. Keep related scripts, references, and assets inside the same skill directory.
4. Run `npm run generate:skills-data` from `web/` to refresh marketplace data.
5. Start the marketplace and verify the skill card, detail view, and installation command.

## License

This project is licensed under the [MIT License](./LICENSE).
