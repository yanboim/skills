# Quality Rules

最终输出前，或正式写入 Notion / GitHub 前，读取并执行本检查。

## 质量检查清单

- title 是否包含核心关键词。
- summary 是否具备 SEO 信息密度。
- category 是否只有一个。
- 如果有新增 category，是否为四个汉字。
- tags 是否不超过 5 个。
- tags 是否与文章内容高度相关。
- category 和 tags 是否优先复用了已有 Notion 选项。
- 新增 category 或 tags 是否都有文章实际信息依据。
- slug 是否为小写 kebab-case。
- slug 是否与已有文章不重复。
- 是否没有编造数据或来源。
- 是否区分事实、观点和推测。
- 正文是否没有重复 H1 标题和 summary 引用块。
- 是否适合 Notion CMS 展示。
- 是否适合 GitHub Markdown 长期归档。
- 如有配图，图片是否来自文章内容或用户指令，而不是无关装饰。
- 如有配图，Markdown 是否使用 `![alt](url)`，且 alt 文本准确、简短。
- 如有配图，图片 URL 是否为稳定公开链接；临时 presigned URL 是否标明过期时间。
- 如有 R2 上传，是否默认使用 S3 API，并确认了 bucket、key、content-type、cache-control 和公开 base URL。
- 如有 R2 上传，是否已检查 `R2_ACCOUNT_ID`、`R2_BUCKET`、`R2_PUBLIC_BASE_URL`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY` 环境变量存在，且没有在输出中展示 secret。
- 如有 R2 上传，正文图片 URL 是否来自上传脚本输出的公开 URL，而不是 S3 endpoint、presigned URL 或本地文件路径。
- 是否没有在输出中暴露 R2 access key、secret 或其他凭证。

## 禁止行为

- 不读取 Notion 现有分类和标签就直接生成 taxonomy。
- 为了 SEO 堆砌无关关键词。
- 一篇文章生成多个 category。
- tags 超过 5 个。
- 新增与已有项语义重复的 category 或 tags。
- 新增不是四个汉字的 category。
- 脱离文章实际表达的信息凭空生成 category 或 tags。
- 编造来源、数据、作者或发布日期。
- 未经确认直接新增分类或标签。
- 未经确认直接把 Draft 改为 Published。
- 未经确认直接写入 Notion、commit GitHub 或 push 到远端。
- 把客户推送内容写得过度营销或承诺收益。
- 把不可长期访问的临时图片链接写进正式发布文章。
- 上传 R2 后未返回图片 URL，或正文里插入了本地文件路径、S3 endpoint 地址、临时签名 URL。
- 插入与文章内容无关、误导性或伪造数据的图片。
