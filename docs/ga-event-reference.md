# Google Analytics 事件参考

中文 | [English](./ga-event-reference_EN.md)

本文档说明 `web/` 市场应用当前实现的 Google Analytics 事件。

## 文档信息

- **类型**：参考文档
- **读者**：需要在 GA 控制台验证事件上报或调整埋点代码的仓库维护者
- **目标**：记录事件名称、触发条件、参数和实现位置

## 范围

包含：

- 应用当前配置的 Measurement ID
- 代码中实现的事件名称和参数
- 负责发送事件的文件位置
- 验证事件上报的操作步骤

不包含：

- 仓库之外的 GA 控制台配置
- GA 自定义维度或受众配置
- 历史分析数据解读

## Measurement ID

应用当前将事件发送到 `G-GYPECK2498`。

GA 初始化代码位于 [layout.tsx](../web/src/app/layout.tsx)。

## 事件汇总

| 事件名称 | 触发条件 | 主要参数 |
|---|---|---|
| `page_view` | 首次加载，以及后续路由或查询参数变化 | `page_path`、`page_location`、`page_title` |
| `nav_github_click` | 点击网站头部的 GitHub 链接 | `target`、`location` |
| `skill_list_impression` | 技能卡片首次进入视口 | `skill_slug`、`skill_name`、`position`、`list_type` |
| `skill_card_click` | 点击市场网格中的技能卡片 | `skill_slug`、`skill_name`、`position`、`source` |
| `skill_detail_view` | 已加载技能的详情弹窗打开 | `skill_slug`、`skill_name`、`install_name` |
| `skill_install_copy` | 点击安装命令复制按钮 | `skill_slug`、`skill_name`、`install_name` |
| `skill_source_click` | 点击技能弹窗中的 GitHub 源文件链接 | `skill_slug`、`skill_name`、`target` |
| `skill_search` | 搜索词保持 500ms 未变化 | `query`、`result_count` |

## 通用参数

| 参数 | 含义 |
|---|---|
| `skill_slug` | 市场和详情 API 使用的路由 slug |
| `skill_name` | UI 中显示的技能名称 |
| `install_name` | `npx skills add ... --skill` 命令使用的安装标识符 |
| `position` | 当前排序后市场网格中从 1 开始的卡片位置 |
| `target` | 被点击外链的目标名称 |

## 事件详情

### `page_view`

**用途**：跟踪首次渲染和客户端导航产生的页面浏览。

**触发条件**：每当 pathname 或查询字符串变化时，由独立客户端组件发送。

| 参数 | 值 |
|---|---|
| `page_path` | 当前 pathname 与查询字符串 |
| `page_location` | 完整浏览器 URL |
| `page_title` | 当前文档标题 |

实现位置：

- [GaPageViewTracker.tsx](../web/src/components/GaPageViewTracker.tsx)
- [gtag.ts](../web/src/lib/gtag.ts)
- [layout.tsx](../web/src/app/layout.tsx)

说明：自动页面浏览已通过 `send_page_view: false` 禁用，以避免与手动路由跟踪重复上报。

### `nav_github_click`

**用途**：跟踪网站头部全局 GitHub 仓库链接的点击。

**触发条件**：用户点击头部 GitHub 链接。

| 参数 | 值 |
|---|---|
| `target` | `github_repo` |
| `location` | `header` |

实现位置：[GithubNavLink.tsx](../web/src/components/GithubNavLink.tsx)

### `skill_list_impression`

**用途**：跟踪用户实际看到的技能卡片。

**触发条件**：卡片首次与视口相交时，每张卡片发送一次。

| 参数 | 值 |
|---|---|
| `skill_slug` | 当前技能 slug |
| `skill_name` | 当前技能展示名称 |
| `position` | 当前网格中从 1 开始的位置 |
| `list_type` | `marketplace_grid` |

实现位置：[SkillCard.tsx](../web/src/components/SkillCard.tsx)

说明：事件在每次卡片挂载周期内去重，可见性由阈值为 `0.5` 的 `IntersectionObserver` 判断。

### `skill_card_click`

**用途**：跟踪用户从市场网格进入技能详情的行为。

**触发条件**：用户点击技能卡片。

| 参数 | 值 |
|---|---|
| `skill_slug` | 当前技能 slug |
| `skill_name` | 当前技能展示名称 |
| `position` | 当前网格中从 1 开始的位置 |
| `source` | `marketplace_grid` |

实现位置：[SkillCard.tsx](../web/src/components/SkillCard.tsx)

### `skill_detail_view`

**用途**：跟踪成功打开的技能详情。

**触发条件**：详情弹窗已打开，且具体技能数据加载完成。

| 参数 | 值 |
|---|---|
| `skill_slug` | 当前技能 slug |
| `skill_name` | 当前技能展示名称 |
| `install_name` | 复制命令使用的安装标识符 |

实现位置：[SkillModal.tsx](../web/src/components/SkillModal.tsx)

说明：加载或错误状态不会发送该事件；同一技能在弹窗保持打开时的重复渲染会被去重。

### `skill_install_copy`

**用途**：跟踪市场 UI 中的技能安装意图。

**触发条件**：用户点击生成安装命令的复制按钮。

| 参数 | 值 |
|---|---|
| `skill_slug` | 当前技能 slug |
| `skill_name` | 当前技能展示名称 |
| `install_name` | 复制命令使用的安装标识符 |

实现位置：[SkillModal.tsx](../web/src/components/SkillModal.tsx)

### `skill_source_click`

**用途**：跟踪从技能弹窗跳转到 GitHub 源文件页面的点击。

**触发条件**：用户点击弹窗头部的源文件链接。

| 参数 | 值 |
|---|---|
| `skill_slug` | 当前技能 slug |
| `skill_name` | 当前技能展示名称 |
| `target` | `github_skill_source` |

实现位置：[SkillModal.tsx](../web/src/components/SkillModal.tsx)

### `skill_search`

**用途**：跟踪用户在市场中的主动搜索行为。

**触发条件**：非空搜索词保持 500ms 未变化。

| 参数 | 值 |
|---|---|
| `query` | 去除首尾空格后的搜索文本 |
| `result_count` | 筛选后技能列表的结果数量 |

实现位置：[Marketplace.tsx](../web/src/components/Marketplace.tsx)

说明：空搜索不会上报；相同的搜索词与结果数量组合会被去重。

## 验证清单

1. 加载首页，确认出现 `page_view`。
2. 滚动市场页面，确认可见卡片产生 `skill_list_impression`。
3. 点击卡片，确认依次出现 `skill_card_click` 和 `skill_detail_view`。
4. 点击弹窗中的复制按钮，确认出现 `skill_install_copy`。
5. 点击弹窗中的 GitHub 源文件链接，确认出现 `skill_source_click`。
6. 在搜索框输入非空内容并停顿至少 500ms，确认出现 `skill_search`。
7. 点击头部 GitHub 链接，确认出现 `nav_github_click`。

## 代码索引

- [layout.tsx](../web/src/app/layout.tsx)
- [gtag.ts](../web/src/lib/gtag.ts)
- [GaPageViewTracker.tsx](../web/src/components/GaPageViewTracker.tsx)
- [GithubNavLink.tsx](../web/src/components/GithubNavLink.tsx)
- [Marketplace.tsx](../web/src/components/Marketplace.tsx)
- [SkillCard.tsx](../web/src/components/SkillCard.tsx)
- [SkillModal.tsx](../web/src/components/SkillModal.tsx)
