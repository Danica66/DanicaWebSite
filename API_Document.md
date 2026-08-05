# API 接口文档

基础地址：`http://localhost:3000/api`

统一响应格式：

```json
{ "code": 200, "data": {...}, "message": "success" }
{ "code": 400, "message": "错误描述", "data": null }
```

---

## 认证

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| POST | `/auth/login` | 否 | 1分/5次 | 登录，返回 token + 用户信息 |
| POST | `/auth/register` | 否 | 1分/5次 | 注册（需先获取邮箱验证码） |
| POST | `/auth/send-code` | 否 | 1分/5次 | 发送注册验证码，60s 冷却 |
| POST | `/auth/refresh` | 否 | 1分/5次 | 刷新 accesstoken |

### POST /auth/login

```json
{ "username": "danica", "password": "123456" }
```

返回：
```json
{
  "accesstoken": "...",
  "refreshtoken": "...",
  "userId": 13,
  "username": "danica",
  "is_admin": 1
}
```

### POST /auth/send-code

```json
{ "email": "user@example.com" }
```

> 仅用于注册场景，会检查邮箱是否已被注册。

### POST /auth/register

```json
{
  "username": "用户名",
  "password": "密码",
  "email": "user@example.com",
  "code": "123456"
}
```

注册成功返回 `{username}`，前端自动调 login 获取 token 并跳转首页。

### POST /auth/refresh

```json
{ "refreshtoken": "..." }
```

---

## 用户（需登录）

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| GET | `/user/profile` | 是 | 全局兜底 | 获取当前用户资料 |
| PUT | `/user/profile` | 是 | 全局兜底 | 更新邮箱 / 头像 |
| POST | `/user/send-code` | 是 | 1分/5次 | 发送换邮箱验证码（不检查是否已注册） |

### GET /user/profile

返回：
```json
{
  "id": 13,
  "username": "danica",
  "email": "danica@example.com",
  "avatar": "/api/avatars/xxx.jpg",
  "email_verified": 1,
  "created_at": "2026-08-05T08:50:08.000Z"
}
```

### PUT /user/profile

```json
{
  "email": "new@example.com",
  "avatar": "/api/avatars/xxx.jpg",
  "code": "123456"
}
```

- `email` 和 `avatar` 均为可选，只传需要更新的字段
- **修改邮箱时必须提供 `code`**（先通过 `POST /user/send-code` 获取验证码）
- 仅改头像时无需 `code`

### POST /user/send-code

```json
{ "email": "new@example.com" }
```

> 与 `/auth/send-code` 的区别：不检查邮箱是否已被注册（因为用户可能想换成别人注册过的邮箱，后端会在更新时校验唯一性）。

---

## 文章（公开）

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| GET | `/articles` | 否 | 15分/100次 | 文章列表（仅已发布），`?page=&limit=&keyword=` |
| GET | `/articles/:id` | 否 | 15分/100次 | 文章详情（浏览 +1），含作者信息 |

### GET /articles 查询参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 是 | — | 页码，>= 1 |
| `limit` | int | 是 | — | 每页条数，1–100 |
| `keyword` | string | 否 | — | 搜索关键词（FULLTEXT，大小写不敏感） |

### GET /articles 返回

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "摘要",
        "cover_image": "/uploads/xxx.jpg",
        "author_id": 13,
        "view_count": 10,
        "status": "published",
        "created_at": "2026-08-05T08:30:00.000Z"
      }
    ],
    "total": 42
  }
}
```

### GET /articles/:id

返回文章详情，含作者 `username` + `avatar`。每次请求 `view_count` +1。

---

## 文章（需登录）

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| GET | `/articles/mine` | 是 | 15分/100次 | 我的文章，`?status=draft\|published` |
| POST | `/articles` | 是 | 15分/100次 | 创建文章 |
| PUT | `/articles/:id` | 是 | 15分/100次 | 更新文章（仅作者） |
| DELETE | `/articles/:id` | 是 | 15分/100次 | 删除文章（仅作者，级联删评论） |

### POST /articles

```json
{
  "title": "标题（必填）",
  "content": "内容（必填）",
  "summary": "摘要（可选）",
  "cover_image": "/uploads/xxx.jpg（可选）",
  "status": "draft|published"
}
```

`status` 不传或非 `"published"` 都视为草稿。

### PUT /articles/:id

同 POST，`title` + `content` 必填，其余可选。

---

## 评论

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| GET | `/articles/:id/comments` | 否 | 全局兜底 | 获取文章所有评论（平铺返回） |
| POST | `/articles/:id/comments` | 是 | 1分/10次 | 发表评论 |
| DELETE | `/comments/:id` | 是 | 1分/10次 | 删除评论（仅作者，级联删子评论） |

### GET /articles/:id/comments 返回

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "article_id": 1,
      "user_id": 13,
      "parent_id": null,
      "content": "评论内容",
      "created_at": "2026-08-05T08:30:00.000Z",
      "username": "danica",
      "avatar": "/api/avatars/xxx.jpg"
    }
  ]
}
```

> 评论以平铺列表返回，前端 `buildTree()` 组装递归树结构。

### POST /articles/:id/comments

```json
{
  "content": "评论内容（必填）",
  "parent_id": null
}
```

`parent_id` 为 `null` → 对文章评论，非空 → 回复某条评论。

---

## 上传

| 方法 | 路径 | 鉴权 | 限流 | 说明 |
|------|------|------|------|------|
| POST | `/upload` | 是 | 全局兜底 | 上传头像（`multipart/form-data`，字段名 `file`） |

限制：仅允许 `.png / .jpg / .jpeg / .gif / .webp`，最大 2 MB。

返回：
```json
{
  "code": 200,
  "data": { "url": "/api/avatars/xxx.jpg" }
}
```

---

## RSS

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/rss` | 否 | RSS 2.0 订阅源（XML），最近 20 篇已发布文章 |
