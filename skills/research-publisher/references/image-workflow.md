# Image Workflow

读取本文件来为文章生成配图、上传 Cloudflare R2、返回图片链接，并把图片插入 Markdown 正文。

## 触发条件

- 用户明确要求“配图”“生成图片”“封面图”“插图”“上传 R2”“图片链接”。
- 用户提供图片指令，要求随文章一起发布。
- 发布目标需要封面图或正文图，但用户没有给出具体图像指令时，只生成保守的配图方案，不要自动上传。

## 输入与决策

先确认或推断以下信息：

- 文章标题、slug、summary、正文结构。
- 图片数量：未指定时默认 1 张封面图；长文或教程可建议 2 到 4 张正文图。
- 图片用途：封面图、章节插图、流程图、概念图、产品图、数据图。
- 视觉风格：用户指定优先；未指定时选择克制、清晰、适合文章主题的编辑风格。
- R2 发布方式：优先使用自定义域名；没有自定义域名时使用已启用公开访问的 r2.dev URL；私有预览才使用 presigned URL。

## 生成配图

默认使用系统 `imagegen` 技能的内置图片生成路径。不要为了普通文章配图改用 CLI/API，除非用户明确要求。

提示词要求：

- 根据文章真实内容生成，不得加入文章没有表达的事实、品牌、人物、数字或结论。
- 默认避免图片内文字、Logo、水印和 UI 假截图；除非用户明确要求文本内容。
- 技术文章优先生成概念示意图、架构图、设备场景图或步骤图。
- 投资 / 研究文章优先生成抽象但具体的主题图，不要伪造行情图、财报数字、K 线或公司标识。
- 每张图都要生成简短 alt 文本，用于 Markdown 和无障碍阅读。

推荐尺寸：

- 封面图：16:9 或 3:2。
- 正文横图：16:9。
- 流程 / 架构图：4:3 或 16:9。
- 社媒预览图：按用户目标平台要求。

## 文件与对象命名

把最终选中的图片保存到工作区，再上传 R2。不要把文章引用的图片只留在 `$CODEX_HOME/generated_images`。

推荐本地路径：

```text
output/research-publisher/images/{{slug}}/{{index}}-{{short-topic}}.{{ext}}
```

推荐 R2 key：

```text
posts/{{YYYY}}/{{MM}}/{{slug}}/{{index}}-{{short-topic}}.{{ext}}
```

命名规则：

- key 使用英文小写、数字和连字符。
- 不使用中文、空格、下划线或容易被 URL 转义破坏的特殊字符。
- 同一文章多张图使用 `01-`、`02-` 前缀保持顺序。
- 如果重传同一张图且内容有变化，使用新文件名或版本后缀，避免浏览器缓存旧图。

## Cloudflare R2 配置

默认使用 S3 兼容 API 上传，优先调用本 skill 附带的脚本：

```bash
# 在 research-publisher 目录执行
node scripts/upload-r2-s3.mjs \
  --file {{local_file}} \
  --key {{key}} \
  --content-type {{mime_type}} \
  --cache-control "public, max-age=31536000, immutable"
```

按当前 Cloudflare R2 文档配置 S3 client：

- endpoint: `https://{{R2_ACCOUNT_ID}}.r2.cloudflarestorage.com`
- region: `auto`
- bucket: `R2_BUCKET`
- credentials: `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY`
- API token 权限：目标 bucket 的 Object Read & Write。默认覆盖保护会先执行 `HeadObject` 检查，因此需要读权限。

脚本行为：

- 上传前检查本地文件是否存在。
- 默认检查目标 key 是否已存在；如已存在则停止，除非显式传入 `--allow-overwrite`。
- 自动输出 JSON，包括 `bucket`、`key`、`url`、`contentType`、`cacheControl` 和 `etag`。
- 正文只能插入脚本输出的 `url`，不要插入本地路径或 S3 endpoint 地址。

建议环境变量：

```text
R2_ACCOUNT_ID
R2_BUCKET
R2_PUBLIC_BASE_URL
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

如果 Codex 或当前终端读不到系统环境变量，可以在 `research-publisher/.env` 中配置同名变量。脚本会自动读取该文件；系统环境变量优先，`.env` 只补充缺失项。不要把 `.env` 提交到 Git。

首次使用前，如果缺少依赖，在 `research-publisher` 目录执行：

```bash
npm install
```

凭证规则：

- 不要在聊天中索要或展示 access key / secret。
- 如果凭证缺失，停止上传，说明需要设置哪些环境变量。
- 上传前检查目标 key 和 base URL，避免覆盖无关对象。

Wrangler 只作为 bucket 公开访问、绑定自定义域名等管理动作的辅助工具；除非用户明确要求，不用 Wrangler 上传图片对象。

## 公开 URL

最终文章中的图片链接必须是可长期访问的公开 URL：

```text
{{R2_PUBLIC_BASE_URL}}/{{key}}
```

`R2_PUBLIC_BASE_URL` 可以是：

- 自定义域名，例如 `https://img.example.com`。
- 已启用公开访问的 r2.dev bucket URL。

Cloudflare R2 当前支持用 Wrangler 启用 r2.dev 公开访问：

```bash
wrangler r2 bucket dev-url enable {{bucket}}
```

也支持把自定义域名绑定到 R2 bucket：

```bash
wrangler r2 bucket domain add {{bucket}} --domain {{domain}} --zone-id {{zone_id}}
```

只有在文章是临时预览、私有分享或用户明确要求时，才使用 presigned GET URL；使用时必须标明过期时间，不要把它写进长期发布的 Markdown 正文。

## Markdown 插入规则

使用标准 Markdown 图片语法：

```markdown
![{{alt_text}}]({{public_image_url}})
```

插入位置：

- 封面图放在 frontmatter 后、第一段正文或第一个 `##` 标题前。
- 正文图放在最相关章节的首段之后，或解释复杂概念的段落之前。
- 同一屏不要连续堆叠多张图；除非用户要求图集。
- 图片不要替代正文中的关键事实、步骤或风险说明。

如果需要 caption，使用普通斜体文本紧跟图片下一行：

```markdown
![{{alt_text}}]({{public_image_url}})

*{{caption}}*
```

## 推送前确认

如果用户没有明确要求“直接生成并上传”，正式上传 R2 前先展示：

```markdown
### 配图计划
- 数量：{{image_count}}
- 风格：{{style}}
- R2 Bucket：{{bucket}}
- Public Base URL：{{public_base_url}}
- 对象 key：
  - {{key1}}
  - {{key2}}
- 插入位置：
  - {{placement1}}
  - {{placement2}}
```

用户确认后再生成最终图片、上传 R2、替换 Markdown 中的图片链接。

## 失败处理

- 图片生成失败：保留无图文章草稿，说明失败原因和可重试的提示词。
- R2 上传失败：不要把不可访问或本地路径写进最终文章；返回本地图片路径和失败原因。
- 公开 URL 无法确定：不要猜测 URL；要求用户提供 `R2_PUBLIC_BASE_URL` 或确认使用 presigned URL。
- 图片内容与文章不匹配：重新生成或移除该图，不要强行插入。
