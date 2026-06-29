---
name: auto-git
description: "一键自动提交推送：自动暂存变更、生成 Conventional Commits 信息、提交并推送，全程无需确认。仅在遇到冲突或异常时才暂停询问。触发词：'提交'、'推送'、'commit'、'push'、'提交并推送'。"
metadata:
  name: Auto Git
  description: 一键自动暂存变更、生成 Conventional Commits 提交信息、提交并推送。
  author: YanBo
  created: 2026-05-08T05:52:00Z
---

# Auto Git 技能

一键自动提交推送，全程不打断。自动暂存所有变更，自动生成 Conventional Commits 提交信息，自动提交并推送。只在遇到冲突或异常时才暂停。

## 前置条件

- Git 已安装且在 PATH 中
- 工作目录在 Git 仓库内

## 执行流程

全程自动化，按顺序执行。不询问、不确认，直接干活。

### 一、预检查 + 拉取

```bash
git rev-parse --is-inside-work-tree 2>&1
git status --porcelain
git fetch origin
git pull --rebase origin $(git branch --show-current) 2>&1
```

- 预检查失败或非 Git 仓库 → 报错停止
- 没有跟踪分支 → 跳过 pull
- pull 出现冲突 → 跳到「冲突处理」
- 一切正常 → 继续

### 二、暂存 + 分析 + 提交 + 推送（全自动）

```bash
# 暂存所有变更（包括新文件）
git add -A

# 如果确实没有变更，停止并告知
git diff --cached --quiet && echo "没有变更" && exit 0

# 查看变更内容用于生成提交信息
git diff --cached --stat
git diff --cached -U3 -- "*.ts" "*.tsx" "*.js" "*.jsx" "*.py" "*.go" "*.rs" "*.java" "*.vue" "*.css" "*.scss" "*.html" "*.md" "*.json" "*.yaml" "*.yml" "*.toml" 2>/dev/null | head -500

# 生成提交信息并提交（见下方规则）
git commit -m "<自动生成的提交信息>"

# 推送
git push origin $(git branch --show-current) 2>&1 || git push -u origin $(git branch --show-current) 2>&1
```

以上四步一次性连续执行，中间不停顿。

### 三、输出摘要

完成后输出一行摘要即可：

```text
✓ <hash短格式> <提交信息> (<分支名>) | <文件数> 文件, +<新增> -<删除>
```

## 提交信息生成规则

格式：`<type>(<scope>): <description>`

类型速选：`feat` 新功能 | `fix` 修复 | `docs` 文档 | `style` 格式 | `refactor` 重构 | `perf` 性能 | `test` 测试 | `chore` 杂项 | `ci` CI/CD | `revert` 回退

规则：

- 祈使语气，首字母小写，72字符以内，不加句号
- 作用域从目录/模块推导，跨模块时省略
- 正文（可选）：解释做了什么和为什么，每行72字符
- 脚注（可选）：`BREAKING CHANGE:` 或 `Closes #issue`

示例：

```text
feat(auth): add OAuth2 login flow
fix(api): handle null response from user service
chore(deps): bump express from 4.18 to 4.19
refactor(db): extract query builder into separate module
```

## 冲突处理

仅在遇到冲突时才暂停流程：

1. 列出冲突文件：`git diff --name-only --diff-filter=U`
2. 读取每个冲突文件的双方内容（grep 冲突标记前后各25行）
3. 向用户展示冲突摘要和解决方案，等待确认后再解决
4. 解决后 `git add` + `git rebase --continue`
5. 继续执行后续的暂存、提交、推送流程

## 异常处理

| 情况 | 处理 |
|------|------|
| Detached HEAD | 报错停止 |
| 受保护分支推送失败 | 建议走 PR，不强制推送 |
| 未完成的合并 | 询问继续还是中止 |
| 认证失败 | 报错，提示检查凭据 |
| 远程有新提交导致推送被拒 | 重新 pull --rebase 后再推送 |
| 大体积 Diff（>500行） | 按文件/函数摘要，不读全文 |
