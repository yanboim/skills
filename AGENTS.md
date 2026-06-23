# 仓库指南

中文 | [English](./AGENTS_EN.md)

## 项目结构与模块组织

本仓库由一个小型 Next.js 技能市场和可安装的技能内容组成。市场应用位于 `web/`：路由、布局和全局样式位于 `web/src/app`，可复用 UI 组件位于 `web/src/components`，解析器和辅助函数位于 `web/src/lib`。静态资源位于 `web/public/`，项目文档位于 `docs/`。每个可安装技能位于 `skills/<skill-name>/`，并应包含一个 `SKILL.md`；相关参考资料、文档和 Agent 配置应与技能放在同一目录。

## 构建、测试与开发命令

所有市场应用命令都应在 `web/` 中运行。使用 `cd web && npm install` 安装依赖。运行 `cd web && npm run dev`，在 [http://localhost:3000](http://localhost:3000) 启动本地 Next.js 服务。运行 `cd web && npm run lint`，使用 ESLint 和 Next.js 规则执行主要质量检查。运行 `cd web && npm run build` 验证生产构建。在 Turbopack 构建工作进程受限的环境中，可以使用 `cd web && npx next build --webpack` 作为后备方案。

## 编码风格与命名约定

使用 TypeScript 和 React，并遵循仓库现有风格：文件保持简洁，使用分号和单引号。React 组件和组件文件使用 PascalCase，例如 `SkillCard.tsx`；工具模块使用小写名称，例如 `utils.ts`。优先遵循 `web/src/app` 中的 App Router 约定。技能目录使用 kebab-case，并尽可能与技能安装名称保持一致。

## 测试指南

仓库目前没有独立的自动化测试套件。在创建 PR 前，必须运行 `cd web && npm run lint` 和 `cd web && npm run build`。修改技能内容后，应手动检查受影响的技能页面，并确认 `SKILL.md` frontmatter 能够正确解析。后续新增测试时，请将其放在相关模块附近或明确命名的 `tests/` 目录中，并使用描述性名称，例如 `skills-api.test.ts`。

## 提交与 Pull Request 指南

近期提交历史采用 Conventional Commits 风格，例如 `feat(subagent-orchestrator): add Codex subagent orchestration skill` 和 `chore(deps): update nextjs monorepo to v16.2.1`。提交标题应使用祈使语气，并在适合时添加作用域。PR 应说明用户可见的改动、列出已执行的验证命令（`cd web && npm run lint`、`cd web && npm run build`），并关联相关 Issue。UI 改动应附截图；新增技能时应注明新的技能 slug、路由或元数据要求。

## 内容与配置说明

使用每个 `SKILL.md` frontmatter 中的 `name` 字段作为安装标识符。除非有明确理由，否则市场 URL slug 与安装名称应保持一致。除非同时更新 `docs/engineering-guide.md` 中的部署文档，否则不要引入必需的环境变量。
