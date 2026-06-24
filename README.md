<div align="center">
  <img src="web/public/favicon.svg" width="64" height="64" alt="YanBo Skills 标志" />

  # YanBo Skills

  面向 AI Agent 的可复用技能集合与可视化技能市场。

  中文 | [English](./README_EN.md)

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-087EA4?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
</div>

---

## 项目简介

YanBo Skills 是一个开放的 AI Agent 技能仓库。每个技能都包含独立的 `SKILL.md`，可以作为 Agent 工作流、AI 助手或其他兼容工具的能力模块直接安装和复用。

仓库由两部分组成：

- `skills/`：可独立安装的技能内容
- `web/`：基于 Next.js 的技能浏览与安装市场

## 功能亮点

- 从 GitHub 交互式选择并安装技能
- 按名称安装指定技能
- 在可视化市场中搜索、浏览并查看完整技能说明
- 一键复制技能安装命令
- 支持浅色、深色和跟随系统主题
- 使用统一、便携的 `SKILL.md` 格式维护技能

## 安装技能

交互式浏览并选择技能：

```bash
npx skills add https://github.com/yanboim/skills
```

直接安装指定技能：

```bash
npx skills add https://github.com/yanboim/skills --skill <skill-name>
```

示例：

```bash
npx skills add https://github.com/yanboim/skills --skill industry-chain-infographic
```

请使用目标技能 `SKILL.md` frontmatter 中的 `name` 作为安装名称。

## 本地开发

```bash
git clone https://github.com/yanboim/skills.git
cd skills/web
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看技能市场。

提交改动前运行：

```bash
npm run lint
npm run build
```

## 添加新技能

1. 在 `skills/<skill-name>/` 下创建技能目录。
2. 添加包含有效 frontmatter 的 `SKILL.md`。
3. 将相关脚本、参考资料和资源文件放在同一技能目录下。
4. 在 `web/` 目录运行 `npm run generate:skills-data` 更新市场数据。
5. 启动市场并检查技能卡片、详情页和安装命令。

## 许可证

本项目采用 [MIT License](./LICENSE)。
