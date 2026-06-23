# Templates

读取本文件来生成 Markdown frontmatter 和正文结构。正文不要再输出 H1 标题，也不要再输出 summary 引用块。

## Markdown Frontmatter

```markdown
---
title: "{{title}}"
type: "Post"
status: "Published"
date: "{{YYYY-MM-DD}}"
slug: "{{slug}}"
summary: "{{summary}}"
category: "{{category}}"
tags:
  - "{{tag1}}"
  - "{{tag2}}"
source: "{{source}}"
notion_page_id: ""
---
```

## 图片插入格式

正文配图使用标准 Markdown，不要新增 H1 标题，也不要把图片链接写成裸 URL。

```markdown
![{{alt_text}}]({{public_image_url}})
```

如需说明图片含义，在图片后添加一行 caption：

```markdown
![{{alt_text}}]({{public_image_url}})

*{{caption}}*
```

封面图放在 frontmatter 后、第一段正文或第一个 `##` 标题前；正文图放在最相关章节中。

## 通用文章正文模板

```markdown
## 一句话结论

{{one_sentence_conclusion}}

## 核心摘要

{{core_summary}}

## 背景信息

{{background}}

## 关键内容

{{key_points}}

## 深度分析

{{analysis}}

## 可行动建议

{{actionable_advice}}

## 风险与不确定性

{{risks}}

## 适合客户阅读的版本

{{client_friendly_version}}

## 后续跟踪

{{follow_up_questions}}
```

## 技术教程正文模板

```markdown
## 适用场景

## 环境准备

## 核心配置思路

## 操作步骤

## 验证方法

## 常见问题

## 安全与风险提示

## 总结
```

## 股票分析正文模板

```markdown
## 结论先行

## 当前关键信息

## 行情性质判断

## 看多逻辑

## 看空逻辑

## 关键分歧

## 不同仓位状态下的策略

## 操作计划

## 风险收益比评分

## 最终决策建议

## 投资风险提示

本文仅用于研究和信息整理，不构成任何投资建议。市场有风险，投资需谨慎。
```
