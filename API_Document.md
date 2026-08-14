# API 接口文档

> 本文档依据 `back/` 目录下的实际代码（routes / controllers / service / DAO）整理。
> 最后核对时间：2026-08-13

## 基础信息

后端路由分两套前缀：

| 前缀 | 用途 | 鉴权 |
|------|------|------|
| `/api/*` | 公开接口（文章读取 / 静态资源 / RSS） | 无需 token（`/api/avatars` 除外，见下文） |
| `/admin/*` | 管理接口（登录 / 文章管理 / 用户 / 上传） | 除登录、刷新外都需要 `Authorization: Bearer <accesstoken>` |

- 生产基础地址：`https://danicablog.cn`（主站，`/api` 前缀）+ 管理台入口（nginx 转发 `/admin` 到后端，实际端口见部署章节）
- 本地开发基础地址：`http://localhost:3000`（front 的 Vite 代理 `/api`，front-manager 的 Vite 代理 `/admin`）
- 数据格式：JSON（`Content-Type: application/json`），上传接口用 `multipart/form-data`
- 鉴权方式：`Authorization: Bearer <accesstoken>`（除标注"公开"的接口外都需要）

### 统一响应格式

```json
// 成功
{ "code": 200, "data": { ... }, "message": "success" }
// 失败
{ "code": 1, "data": null, "message": "错误描述" }
```

| 字段 | 说明 |
|------|------|
| `code` | `200` 成功；非 200 失败（业务错误码为 `1`，HTTP 状态码仍按语义返回 400/401/404/500） |
| `data` | 业务数据，失败时为 `null` |
| `message` | 提示信息 |

失败时 HTTP 状态码：400 参数错误 / 401 未登录或 token 失效 / 404 资源不存在 / 500 服务器错误。

### 鉴权白名单（`middleware/auth.ts`）

以下请求**无需 token**，其余路径一律校验（缺失 → 401 `缺少 token`，无效 → 401 `token 无效或已过期`）：

| 路径正则 | 方法 | 说明 |
|----------|------|------|
| `/admin/auth/login` | POST | 登录 |
| `/admin/auth/refresh` | POST | 刷新 token |
| `/api/articles` | GET | 公开文章列表 |
| `/api/articles/:id` | GET | 公开文章详情 |
| `/api/rss` | GET | RSS |
| `/api/images/.+` | GET | 上传的图片（uploads） |

> ⚠️ 注意：`/api/avatars/.+` **不在**白名单中。头像目录（`public/avatars`）挂在鉴权中间件之后，公开页面（游客无 token）访问头像会返回 401。主站文章若展示作者头像需要留意此点（建议后续把 avatars 加入白名单，或前端带头像接口改为需鉴权）。

### 限流（`middleware/rateLimit.ts`）

| 作用域 | 挂载位置 | 规则 | 触发返回 |
|--------|----------|------|----------|
| `/api` 全局 | `app.use('/api', globalLimiter)` | 15 分钟 200 次 | 429 |
| `/admin/auth` | `app.use('/admin/auth', authLimiter)` | 1 分钟 5 次 | 429 |
| `/api/articles` | `app.use('/api/articles', publicLimiter)` | 15 分钟 100 次 | 429 |

> 管理员文章接口（`/admin/articles`）当前未单独限流，仅受全局兜底影响（注意 `/admin` 前缀不经过 `/api` 全局限流，目前实际无限流）。

---

## 认证

| 方法 | 路径 | 限流 | 说明 |
|------|------|------|------|
| POST | `/admin/auth/login` | 1分/5次 | 登录，返回 accesstoken + refreshtoken + 用户信息 |
| POST | `/admin/auth/refresh` | 1分/5次 | 用 refreshtoken 换取新的 accesstoken |

### POST /admin/auth/login

请求：

```json
{ "username": "danica", "password": "123456" }
```

返回：

```json
{
  "code": 200,
  "data": {
    "accesstoken": "eyJ...",
    "refreshtoken": "eyJ...",
    "userId": 13,
    "username": "danica",
    "is_admin": 1
  },
  "message": "登录成功"
}
```

- `username` 或 `password` 缺失 → 400 `用户名或密码不能为空`
- 用户名或密码错误 → 400 `用户名或密码错误`
- `is_admin`：`1` 管理员，`0` 普通用户

### POST /admin/auth/refresh

请求：

```json
{ "refreshtoken": "eyJ..." }
```

返回：

```json
{ "code": 200, "data": { "accesstoken": "eyJ..." }, "message": "刷新成功" }
```

- `refreshtoken` 缺失 → 400 `缺少refreshtoken`
- refreshtoken 无效或过期 → 400 `refreshtoken无效或过期,请重新登录`

### 前端 token 刷新约定（front-manager 现有实现）

- accesstoken 过期后任意请求返回 401，前端自动调 `/auth/refresh` 重试一次（axios 响应拦截器）
- 刷新失败 → 清空本地登录态并跳转登录页

---

## 用户（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/user/profile` | 获取当前登录用户资料 |
| PUT | `/admin/user/profile` | 更新当前用户资料（邮箱 / 头像） |

### GET /admin/user/profile

返回：

```json
{
  "code": 200,
  "data": {
    "id": 13,
    "username": "danica",
    "email": "danica@example.com",
    "avatar": "/api/avatars/xxx.jpg",
    "email_verified": 0,
    "created_at": "2026-08-05T08:50:08.000Z"
  },
  "message": "获取用户信息成功"
}
```

> `password` 字段不会返回。

### PUT /admin/user/profile

请求（`email`、`avatar` 均为可选，传哪个更新哪个）：

```json
{ "email": "new@example.com", "avatar": "/api/avatars/xxx.jpg" }
```

返回：`{ "code": 200, "data": null, "message": "更新用户信息成功" }`

---

## 公开文章（无需登录）

| 方法 | 路径 | 限流 | 说明 |
|------|------|------|------|
| GET | `/api/articles` | 15分/100次 | 文章列表（仅已发布），支持分页 + 关键词搜索 |
| GET | `/api/articles/:id` | 15分/100次 | 文章详情（默认 view_count +1） |

### GET /api/articles 查询参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 是 | — | 页码，>= 1 |
| `limit` | int | 是 | — | 每页条数，1–100 |
| `keyword` | string | 否 | — | 搜索关键词（FULLTEXT 索引，匹配 title + summary，BOOLEAN MODE） |

返回：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "摘要",
        "cover_image": "/api/images/xxx.png",
        "author_id": 13,
        "view_count": 10,
        "created_at": "2026-08-05T08:30:00.000Z"
      }
    ],
    "total": 42
  },
  "message": "获取文章成功"
}
```

> 列表接口**不返回** `content` 和 `status` 字段（SQL 只查 `id, title, summary, cover_image, author_id, view_count, created_at`）。

### GET /api/articles/:id

返回文章全部字段（含 `content`、`status` 等）：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "文章标题",
    "content": "# Markdown 正文",
    "summary": "摘要",
    "cover_image": null,
    "author_id": 13,
    "view_count": 10,
    "status": "published",
    "created_at": "2026-08-05T08:30:00.000Z",
    "updated_at": "2026-08-05T08:30:00.000Z"
  },
  "message": "id:1查找文章成功"
}
```

**阅读数控制（重要）**：默认每次请求 `view_count + 1`。管理台查看/编辑时请带上参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `noCount` | string | `noCount=1` 时不增加阅读数（管理台专用） |

示例：`GET /api/articles/1?noCount=1`

> 不返回作者信息（`username` / `avatar`），如需展示作者请走 `/admin/user/profile` 或扩展接口。

---

## 文章管理（需登录，控制台核心）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/articles` | 文章列表（全部状态，支持按状态筛选 + 分页 + 搜索） |
| GET | `/admin/articles/:id` | 文章详情（`?noCount=1` 不增加阅读数） |
| POST | `/admin/articles` | 创建文章 |
| PUT | `/admin/articles/:id` | 更新文章（仅作者本人） |
| DELETE | `/admin/articles/:id` | 删除文章（仅作者本人） |

### GET /admin/articles 查询参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 是 | — | 页码，>= 1 |
| `limit` | int | 是 | — | 每页条数，1–100 |
| `keyword` | string | 否 | — | 搜索关键词（匹配 title + summary） |
| `status` | string | 否 | `published` | `draft` 或 `published`，筛选文章状态 |

返回（结构与公开列表相同，按 `created_at DESC`）：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "标题",
        "summary": "摘要",
        "cover_image": null,
        "author_id": 13,
        "view_count": 0,
        "created_at": "2026-08-05T08:30:00.000Z"
      }
    ],
    "total": 10
  },
  "message": "获取draft文章成功"
}
```

> 同样**不返回 `content` 和 `status`**。编辑回填内容请用 `GET /admin/articles/:id?noCount=1`（返回全部字段，含 content/status）。

### POST /admin/articles

请求：

```json
{
  "title": "标题（必填）",
  "content": "# 正文（必填）",
  "summary": "摘要（可选）",
  "cover_image": "/api/images/xxx.png（可选）",
  "status": "draft | published"
}
```

- `title`、`content` 必填，缺失 → 400 `缺少文章标题或内容`
- `status` 非 `"published"`（含不传）一律存为 `draft`
- `author_id` 取自 token，前端无需传

返回：`{ "code": 200, "data": [插入结果], "message": "发布文章成功" }`

### PUT /admin/articles/:id

请求体同 POST（`title` + `content` 必填，其余可选）。

- 文章不存在 → 400 `文章不存在`
- 非作者操作 → 400 `无权限操作`

### DELETE /admin/articles/:id

无请求体。

- 文章不存在 → 400 `文章不存在`
- 非作者操作 → 400 `无权限操作`

---

## 图片上传（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/admin/upload` | 上传图片，`multipart/form-data`，字段名 `image` |

返回：

```json
{ "code": 200, "data": { "url": "/api/images/xxx.png" }, "message": "上传成功" }
```

返回的 `url` 可直接写入文章 markdown：`![图片](/api/images/xxx.png)`。

限制：

- 仅允许 `image/jpeg` / `image/png` / `image/webp` / `image/gif`（**svg 已拒绝**，可内嵌脚本）
- 最大 5 MB（超出 → 400 `图片不能超过 5MB`）
- 文件名服务端随机生成（`时间戳-随机hex.扩展名`），防路径穿越与重名覆盖
- 缺文件 → 400 `缺少图片文件（字段名: image）`
- 非图片类型 → 400 `仅支持 JPG/PNG/WebP/GIF 图片`

---

## 静态资源

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/images/:file` | 公开（白名单） | 上传的图片（`express.static('uploads')`） |
| GET | `/api/avatars/:file` | ⚠️ 需 token | 用户头像（`express.static('public/avatars')`） |

- Docker 部署：图片持久化在 `uploads-data` volume（`/app/uploads`），容器重建不丢

---

## RSS（公开）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/rss` | RSS 2.0 订阅源（XML），最近 20 篇已发布文章 |

返回 `Content-Type: application/xml; charset=utf-8`，包含 title / link / description / pubDate / guid，CDATA 已转义（`]]>` 防 XSS）。

---

## 部署与代理说明

- 主站 nginx（front 容器）：`location /api/` → `proxy_pass http://back:3000`（路径原样转发）
- 管理台 nginx（front-manager 容器）：`location /admin/` → `proxy_pass http://back:3000`（路径原样转发）
- 管理台前端构建时必须设置 `VITE_API_BASE_URL=/admin`（Dockerfile 内 ENV 会覆盖 `.env`，两处需保持一致；曾因误配为 `/api` 导致请求落到静态文件返回 405）

---

## 已移除 / 不存在接口（勿在新代码中调用）

以下接口在旧文档中存在、但当前代码**没有实现**（routes 中无注册，调用会 404 或 401）：

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（已移除） |
| POST | `/auth/send-code` | 注册邮箱验证码（已移除） |
| POST | `/user/send-code` | 换邮箱验证码（已移除） |
| GET | `/articles/mine` | 我的文章列表（已改为 `/admin/articles`） |
| GET | `/articles/:id/comments` | 评论列表（已移除，主站改用 giscus） |
| POST | `/articles/:id/comments` | 发表评论（已移除） |
| DELETE | `/comments/:id` | 删除评论（已移除） |
