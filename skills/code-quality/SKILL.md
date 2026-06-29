---
name: code-quality
description: "全自动代码质量检查：Lint 规范、静态分析、安全审查、性能问题。仅报告不修复，终端直接输出结果。触发词：'代码检查'、'质量检查'、'code review'、'lint'、'code quality'。"
metadata:
  name: 代码质量检查
  description: 对项目执行 Lint、静态分析、安全审查和性能问题检查，仅报告不自动修复。
  author: YanBo
  created: 2026-05-08T06:30:00Z
---

# 代码质量检查技能

对当前项目的代码进行全面质量检查，涵盖 Lint 规范、静态分析、安全审查和性能问题四个维度。全自动执行，仅报告问题不自动修复，终端直接输出结果。

## 前置条件

- 工作目录在项目根目录
- 已安装项目依赖（node_modules / venv 等）

## 执行流程

全程自动化，按顺序执行四个检查维度。不修复、不修改任何文件。

### 一、项目检测

首先识别项目类型和可用工具：

```bash
# 检测项目类型
ls package.json tsconfig.json pyproject.toml setup.py go.mod Cargo.toml pom.xml build.gradle 2>/dev/null

# 检测已安装的检查工具
which eslint tsc pycodestyle flake8 pylint ruff mypy go vet cargo clippy shellcheck 2>/dev/null

# 检查 package.json 中的 scripts
cat package.json 2>/dev/null | grep -A5 '"scripts"'
```

根据检测结果，跳过项目中不存在的工具/语言，只执行相关检查。

### 二、代码规范检查（Lint）

根据项目语言自动选择工具执行：

**JavaScript / TypeScript：**

```bash
# ESLint
npx eslint . --format compact 2>&1 | head -100

# 如有 Prettier 检查
npx prettier --check . 2>&1 | head -50
```

**Python：**

```bash
# 优先用 ruff（快），其次 flake8
ruff check . 2>&1 | head -100 || flake8 . 2>&1 | head -100
```

**Go：**

```bash
go vet ./...
```

**Rust：**

```bash
cargo clippy 2>&1 | head -100
```

**Shell：**

```bash
shellcheck scripts/*.sh 2>&1
```

如果项目没有任何 lint 工具，跳过此维度并提示"未检测到 Lint 工具，建议配置 ESLint/ruff 等"。

### 三、静态分析

**TypeScript 类型检查：**

```bash
npx tsc --noEmit 2>&1 | head -100
```

**Python 类型检查：**

```bash
mypy . 2>&1 | head -100 || pyright 2>&1 | head -100
```

**通用——未使用变量和导入：**

```bash
# JS/TS
grep -rn "unused\|never read\|declared but" --include="*.ts" --include="*.tsx" --include="*.js" . 2>/dev/null | head -30
```

**通用——TODO/FIXME/HACK 标记：**

```bash
grep -rn "TODO\|FIXME\|HACK\|XXX\|NOQA" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" --include="*.go" --include="*.rs" --include="*.java" . 2>/dev/null | grep -v node_modules | grep -v ".git" | head -50
```

### 四、安全审查

**硬编码密钥和凭证：**

```bash
grep -rn -i "password\s*=\|secret\s*=\|api_key\s*=\|apikey\s*=\|token\s*=\|Bearer\s" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" --include="*.go" --include="*.java" \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=build . 2>/dev/null | \
  grep -v "test\|mock\|example\|placeholder\|env\.\|process\.env\|os\.environ\|TODO" | head -50
```

**危险函数调用：**

```bash
# SQL 拼接（注入风险）
grep -rn -i "execute.*+.*\|query.*+.*\|raw.*+.*\|format.*sql\|%s.*select\|%.*SELECT" \
  --include="*.py" --include="*.ts" --include="*.js" --include="*.go" --include="*.java" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -30

# eval / innerHTML / exec（代码注入风险）
grep -rn -i "\beval\s*(\|\.innerHTML\s*=|os\.system\s*(\|subprocess.*shell\s*=\s*True\|exec\s*(" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" --include="*.go" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -30

# 不安全的反序列化
grep -rn -i "pickle\.load\|yaml\.load\s*(\|unserialize\|JSON\.parse.*input\|execSync" \
  --include="*.py" --include="*.ts" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -20
```

**依赖漏洞检查：**

```bash
npm audit 2>&1 | head -30 || pip audit 2>&1 | head -30 || cargo audit 2>&1 | head -30
```

### 五、性能问题

**潜在 N+1 查询：**

```bash
grep -rn -i "for.*\n.*query\|for.*\n.*fetch\|for.*\n.*select\|for.*\n.*find\|for.*\n.*load" \
  --include="*.py" --include="*.ts" --include="*.js" --include="*.go" --include="*.java" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -20
```

**大循环内的重复操作：**

```bash
grep -rn -B1 "forEach\|\.map(\|for.*range\|for.*in\s" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | \
  grep -A1 "forEach\|\.map(\|for.*range" | \
  grep -i "await\|async\|query\|fetch\|request\|http\|db\." | head -30
```

**同步阻塞调用：**

```bash
grep -rn -i "\.sync\(\|fs\.readFileSync\|fs\.writeFileSync\|child_process\.execSync\|sleep\s*(" \
  --include="*.ts" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -20
```

**缺少索引提示（大表全表扫描模式）：**

```bash
grep -rn -i "SELECT \*\|\.find(\s*{\s*}\s*)\|\.findAll(\s*{\s*}\s*)\|collection\.find\s*({})" \
  --include="*.ts" --include="*.js" --include="*.py" \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=test --exclude-dir=tests --exclude-dir=__tests__ . 2>/dev/null | head -20
```

### 六、输出结果

全部检查完成后，按以下格式在终端输出：

```text
## 代码质量检查报告

项目：<项目名> | 分支：<分支名>

### 📋 代码规范 (Lint)
- ESLint: ⚠️ 3 个警告, ❌ 1 个错误
  - src/auth.ts:45:10 - 'unused' is defined but never used
  - src/api.ts:23:5 - Unexpected console statement
  ...

### 🔍 静态分析
- TypeScript: ✅ 无类型错误
- 未使用导入: 2 处
  - src/utils.ts:3 - import { unused } from './helper'
  ...

### 🔒 安全审查
- 硬编码凭证: ⚠️ 1 处
  - src/config.ts:12 - password = "admin123"
- 危险函数: ✅ 未发现
- 依赖漏洞: ⚠️ 2 个低危
  ...

### ⚡ 性能问题
- 潜在 N+1: 1 处
  - src/service.ts:78 - 循环内调用 fetchUser
- 同步阻塞: 2 处
  ...

---
汇总：❌ 3 错误 | ⚠️ 8 警告 | ℹ️ 5 提示 | ✅ 通过 2 项
```

每项检查如果通过，显示 ✅ 和一句话说明。如果有问题，列出文件路径、行号和具体内容。

如果某个维度因缺少工具而跳过，标注"⊘ 未检测到相关工具，已跳过"。

## 异常处理

| 情况 | 处理 |
|------|------|
| 项目根目录无法识别 | 报错停止 |
| 依赖未安装 | 提示运行安装命令，停止 |
| 工具执行超时（>30秒） | 跳过该工具，记录超时 |
| grep 无匹配结果 | 该项显示 ✅ 通过 |
| 项目无任何匹配语言 | 提示不支持的项目类型 |
