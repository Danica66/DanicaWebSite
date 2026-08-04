# API 接口文档

基础地址：`http://localhost:3000/api`

所有接口统一响应格式：

```json
{ "code": 200, "data": {...}, "message": "success" }
{ "code": 400, "message": "错误描述", "data": null }
```

---

## 认证

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/auth/login` | 否 | 登录，返回 token + 用户信息 |
| POST | `/auth/register` | 否 | 注册（需先获取邮箱验证码） |
| POST | `/auth/send-code` | 否 | 发送邮箱验证码，60s 冷却 |
| POST | `/auth/refresh` | 否 | 刷新 accesstoken |

### POST /auth/send-code

```json
{ "email": "user@example.com" }
```

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

---

## 文章（公开）

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles` | 否 | 文章列表（仅已发布），`?page=&limit=&keyword=` |
| GET | `/articles/:id` | 否 | 文章详情（浏览 +1），含作者信息 |
| GET | `/rss` | 否 | RSS 2.0 订阅源（XML） |

### GET /articles 查询参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 是 | — | 页码，>= 1 |
| `limit` | int | 是 | — | 每页条数，1–100 |
| `keyword` | string | 否 | — | 搜索关键词（全文索引，大小写不敏感） |

### GET /articles 返回示例

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
        "author_id": 4,
        "view_count": 10,
        "created_at": "2026-07-24T08:30:00.000Z"
      }
    ],
    "total": 42
  }
}
```

---

## 文章（需登录）

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles/mine` | 是 | 我的文章，`?status=draft\|published` |
| POST | `/articles` | 是 | 创建文章 |
| PUT | `/articles/:id` | 是 | 更新文章（仅作者） |
| DELETE | `/articles/:id` | 是 | 删除文章（仅作者，级联删评论） |

### POST /articles 请求体

```json
{
  "title": "标题（必填）",
  "content": "内容（必填）",
  "summary": "摘要（可选）",
  "cover_image": "/uploads/xxx.jpg（可选）",
  "status": "draft|published"
}
```
- `status` 不传或非 `"published"` 都视为草稿

### PUT /articles/:id 请求体

同 POST，`title` + `content` 必填，`summary`/`cover_image`/`status` 可选。

---

## 评论

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles/:id/comments` | 否 | 获取文章所有评论（含嵌套关系） |
| POST | `/articles/:id/comments` | 是 | 发表评论 |
| DELETE | `/comments/:id` | 是 | 删除评论（仅作者，级联删子评论） |

### GET /articles/:id/comments 返回示例

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "article_id": 1,
      "user_id": 4,
      "parent_id": null,
      "content": "评论内容",
      "created_at": "2026-07-24T08:30:00.000Z",
      "updated_at": "2026-07-24T08:30:00.000Z",
      "username": "danica",
      "avatar": "/api/avatars/xxx.jpg"
    }
  ]
}
```
> 评论以平铺列表返回，前端 `buildTree()` 组装树结构。

### POST /articles/:id/comments 请求体

```json
{
  "content": "评论内容（必填，最长 1000）",
  "parent_id": null
}
```
- `parent_id` 为 `null` 表示对文章评论，非空表示回复某条评论

---

## 用户

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/user/profile` | 是 | 获取当前用户资料 |
| PUT | `/user/profile` | 是 | 更新邮箱 / 头像 |

### PUT /user/profile 请求体

```json
{
  "email": "your@email.com",
  "avatar": "/api/avatars/xxx.jpg"
}
```

---

## 上传

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/upload` | 是 | 上传头像（`multipart/form-data`，字段名 `file`） |

返回：
```json
{
  "code": 200,
  "data": { "url": "/api/avatars/xxx.jpg" }
}
```
