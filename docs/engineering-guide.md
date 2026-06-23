# Yanbo Skills 工程指南

中文 | [English](./engineering-guide_EN.md)

本文档详细说明 **Yanbo Skills** 市场的开发、调试、构建与部署流程。

## 1. 技术栈概览

- **前端框架**：[Next.js 16（App Router）](https://nextjs.org/)
- **语言**：TypeScript
- **样式**：Tailwind CSS + `@tailwindcss/typography`
- **动画**：Framer Motion
- **无障碍组件**：Headless UI
- **数据解析**：gray-matter（Markdown frontmatter 解析）
- **图标库**：Lucide React
- **代码检查**：ESLint + `eslint-config-next`

## 2. 本地开发

克隆仓库后，执行以下命令启动开发服务器：

```bash
cd web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 预览。

## 3. 数据维护

技能数据存放在仓库根目录的 `skills/` 中。

### 添加新技能

1. 在 `skills/` 中创建新目录，例如 `my-new-skill`。
2. 在该目录中创建 `SKILL.md`。
3. 填写 `SKILL.md` 顶部的元数据并编写主体内容：

```markdown
---
name: my-new-skill
description: A concise summary of what this skill does and when to use it.
---

# Skill Title
Write the full Markdown documentation for the skill here.
```

4. 在 `web/` 中运行 `npm run generate:skills-data` 更新市场数据。

## 4. 调试与常见问题

- **图标未显示**：确认图标名称符合 [Lucide Icons](https://lucide.dev/icons) 的命名约定。
- **样式未更新**：检查 `web/src/app/globals.css` 中的 Tailwind 配置。
- **Markdown 渲染错误**：检查 `SKILL.md` 的 YAML frontmatter，确保使用 `---` 包裹且没有 YAML 语法错误。
- **安装命令不正确**：使用 frontmatter 中的 `name` 字段作为安装标识符。市场深链接 slug 是独立的 URL 概念。
- **Next.js 升级后 lint 失败**：通过 `npm run lint` 使用 ESLint CLI；Next.js 16 不再支持 `next lint`。
- **移动后 Web 应用找不到技能**：市场应用从 `web/` 运行，并读取仓库根目录的 `skills/`。
- **新增技能未立即显示**：重新运行数据生成脚本并重启开发服务器，以清除服务端数据缓存。

## 5. 构建与测试

生产部署前建议执行完整构建验证：

```bash
cd web

# 运行代码检查
npm run lint

# 运行完整构建
npm run build
```

构建成功后，首页会被预渲染，技能详情 API 路由会按需提供数据。

如果受限的本地沙箱出现 Turbopack 进程错误，可使用：

```bash
npx next build --webpack
```

该后备方案主要用于受限环境；标准部署仍可使用 `npm run build`。

## 6. 部署指南（以 Vercel 为例）

本项目兼容 Vercel，建议使用自动化构建：

1. **关联 Git 仓库**：将仓库导入 Vercel。
2. **构建设置**：将项目根目录设置正确后，Vercel 会自动识别 Next.js。
   - Root Directory：`web`
   - Framework Preset：`Next.js`
   - Build Command：`npm run build`
   - Install Command：`npm install`
3. **环境变量**：项目当前不需要特定的生产环境变量。
4. **部署**：点击 Deploy，等待构建完成。

### 其他部署方式

- **Docker**：使用官方 Next.js 镜像进行容器化部署。
- **静态导出**：项目使用 API 路由动态加载详情，除非改造为静态路由，否则不建议使用 `next export`。

---

更多技术信息请参考 [Next.js 文档](https://nextjs.org/docs)。
