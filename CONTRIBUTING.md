# 贡献指南

中文 | [English](./CONTRIBUTING_EN.md)

本文档定义了本仓库中 `skills/*/SKILL.md` 文件的最低贡献要求。除非另有说明，新增或修改技能时均应遵循这些规则。

## 适用范围

- `SKILL.md` 必须使用有效的 YAML frontmatter。
- 现有的 `name` 和 `description` frontmatter 字段仍是技能的主要身份字段。
- 需要仓库级或展示用途的附加元数据时，请使用 `metadata` 对象。
- 面向使用者的技能说明内容应使用英文编写。

## 元数据

每个 `SKILL.md` 都应包含 `metadata` 字段，且 `metadata` 必须是对象。当前约定如下：

```yaml
metadata:
  name: Human-readable skill name
  description: One sentence describing what the skill is for.
  author: Yanbo
  created: 2026-03-28T13:15:00Z
  version: 1.0.0
```

字段要求：

| 键 | 类型 | 要求 | 规则 |
|---|---|---|---|
| `name` | string | 必需 | 默认根据技能名称生成易读的展示名称 |
| `description` | string | 必需 | 描述技能用途，而不是内部实现方式 |
| `author` | string | 必需 | 根据技能最早记录的作者确定 |
| `created` | string | 必需 | 根据最早创建时间确定，并格式化为 UTC `YYYY-MM-DDTHH:mm:ssZ` |
| `version` | string | 可选 | 技能元数据版本；没有版本策略时不设置 |

附加规则：

- `metadata` 必须位于 YAML frontmatter 内。
- `metadata` 的键必须使用小写英文字段名。
- `metadata` 的值必须是标量字符串。
- `name` 默认应将技能 `name` 转换为标题式展示文本。
- `name` 默认应移除连字符并将每个单词首字母大写。
- `name` 应保留知名品牌的大小写和常见全大写缩写。
- `description` 应保持为一个句子。
- `description` 应少于 150 个字符。
- `description` 不应描述内部步骤、调用链或实现细节。
- `created` 必须使用以 `Z` 结尾的 UTC ISO 8601 时间戳。
- 如果存在 `version`，应使用 `MAJOR.MINOR.PATCH` 语义化版本格式。
- `version` 表示当前元数据或技能定义版本，而不是 Git 提交、日期或分支名称。
- 除非存在明确的版本策略，否则不要推断或自动递增 `version`。

## 事实来源

- `metadata.author` 和 `metadata.created` 的初始值应来自 Git 历史。
- 优先使用目标 `SKILL.md` 最早的提交记录。
- 如果文件历史不能反映技能的真实创建时间，可以改用技能目录的首次提交，但应在提交说明中注明原因。

## 更新策略

- 新技能应尽早添加 `metadata`。
- 首次修改缺少 `metadata` 的现有技能时，应补充该字段。
- 修改技能主体内容时，不应同时更改 `author` 或 `created`。
- 没有明确版本策略时，`version` 应保持未设置。
- 只有在技能明确采用版本管理时，才设置或更新 `version`。
- 只有在现有元数据确实错误时才进行修正。

## 示例

```yaml
---
name: skill-metadata-maintainer
description: Maintain metadata for one target skill by reading repository rules, inspecting the current SKILL.md, and deriving historical fields from git before proposing changes.
metadata:
  name: Skill Metadata Maintainer
  description: Initialize or update the metadata object in one target skill's SKILL.md.
  author: Yanbo
  created: 2026-03-28T13:15:00Z
---
```
