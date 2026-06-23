# Repository Guidelines

[中文](./AGENTS.md) | English

## Project Structure and Module Organization

This repository combines a small Next.js marketplace app with installable skill content. The marketplace lives under `web/`: routes, layout, and global styles are in `web/src/app`, reusable UI components are in `web/src/components`, and parsers and helpers are in `web/src/lib`. Static assets are under `web/public/`, and project documentation is under `docs/`. Each installable skill lives in `skills/<skill-name>/` and should include a `SKILL.md`; related references, documentation, and agent configuration should stay beside it.

## Build, Test, and Development Commands

Run marketplace commands from `web/`. Use `cd web && npm install` to install dependencies. Run `cd web && npm run dev` to start the local Next.js server at [http://localhost:3000](http://localhost:3000). Run `cd web && npm run lint` for the primary quality gate with ESLint and Next.js rules. Run `cd web && npm run build` to verify the production output. In restricted environments where Turbopack build workers fail, use `cd web && npx next build --webpack` as a fallback.

## Coding Style and Naming Conventions

Write TypeScript and React following the repository's current style: concise files, semicolons, and single quotes. Keep React components and component files in PascalCase, such as `SkillCard.tsx`; utility modules use lowercase names such as `utils.ts`. Prefer App Router conventions in `web/src/app`. Keep skill directory names in kebab-case and align them with the skill installation name where possible.

## Testing Guidelines

There is no dedicated automated test suite yet. Treat `cd web && npm run lint` and `cd web && npm run build` as required validation before opening a PR. For skill content changes, manually verify the affected skill page and confirm that the `SKILL.md` frontmatter parses correctly. If you add tests later, place them near the relevant module or in a clearly named `tests/` directory and use descriptive names such as `skills-api.test.ts`.

## Commit and Pull Request Guidelines

Recent history follows Conventional Commits style, for example `feat(subagent-orchestrator): add Codex subagent orchestration skill` and `chore(deps): update nextjs monorepo to v16.2.1`. Keep commit subjects imperative and scoped when useful. PRs should explain the user-visible change, list the validation performed (`cd web && npm run lint`, `cd web && npm run build`), and link related issues. Include screenshots for UI changes and note any new skill slugs, routes, or metadata expectations.

## Content and Configuration Notes

Use the `name` field in each `SKILL.md` frontmatter as the installation identifier. Keep marketplace URL slugs and installation names aligned unless there is a clear reason not to. Avoid introducing required environment variables unless the deployment documentation in `docs/engineering-guide.md` is updated at the same time.
