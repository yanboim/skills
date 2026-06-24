# YanBo Skills Engineering Guide

[中文](./engineering-guide.md) | English

This document provides detailed guidance for developing, debugging, building, and deploying the **YanBo Skills** marketplace.

## 1. Tech Stack Overview

- **Frontend Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **Animations**: Framer Motion
- **Accessible Components**: Headless UI
- **Data Parsing**: gray-matter (Markdown frontmatter parsing)
- **Icon Library**: Lucide React
- **Linting**: ESLint with `eslint-config-next`

## 2. Local Development

After cloning the repository, run the following commands to start the development server:

```bash
cd web

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for a preview.

## 3. Data Maintenance

Skill data is stored in the repository-root `skills/` directory.

### Add a new skill

1. Create a new directory under `skills/`, for example `my-new-skill`.
2. Create a `SKILL.md` in that directory.
3. Fill in the metadata at the top of `SKILL.md` and write its main content:

```markdown
---
name: my-new-skill
description: A concise summary of what this skill does and when to use it.
---

# Skill Title
Write the full Markdown documentation for the skill here.
```

4. Run `npm run generate:skills-data` from `web/` to refresh the marketplace data.

## 4. Debugging and Common Issues

- **Icons not displaying**: Ensure the icon name follows the [Lucide Icons](https://lucide.dev/icons) naming conventions.
- **Styles not updating**: Verify the Tailwind configuration in `web/src/app/globals.css`.
- **Markdown rendering errors**: Check the YAML frontmatter in `SKILL.md`; it must be wrapped in `---` and contain no YAML syntax errors.
- **Installation command looks wrong**: Use the frontmatter `name` field as the installation identifier. The marketplace deep-link slug is a separate URL concern.
- **Lint command fails after a Next.js upgrade**: Use the ESLint CLI through `npm run lint`; Next.js 16 no longer supports `next lint`.
- **Web app cannot find skills after the move**: The marketplace runs from `web/` and reads content from the repository-root `skills/` directory.
- **New skills do not appear immediately**: Regenerate the marketplace data and restart the development server to clear the server-side data cache.

## 5. Build and Testing

Run a full build validation before production deployment:

```bash
cd web

# Run lint checks
npm run lint

# Run the full build
npm run build
```

After a successful build, the homepage is prerendered and the skill detail API route serves data on demand.

If a restricted local sandbox encounters a Turbopack process error, use:

```bash
npx next build --webpack
```

This fallback is mainly useful in constrained environments; standard deployments can continue using `npm run build`.

## 6. Deployment Guide (Vercel Example)

This project is compatible with Vercel, and an automated build is recommended:

1. **Link the Git repository**: Import the repository into Vercel.
2. **Configure build settings**: Vercel recognizes Next.js after the project root is configured correctly.
   - Root Directory: `web`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Install Command: `npm install`
3. **Environment variables**: The project currently requires no specific production environment variables.
4. **Deploy**: Click Deploy and wait for the build to finish.

### Other Deployment Methods

- **Docker**: Use official Next.js images for containerized deployment.
- **Static export**: The project uses an API route for dynamic detail loading, so `next export` is not recommended unless the app is adapted to static routing.

---

For more technical information, refer to the [Next.js documentation](https://nextjs.org/docs).
