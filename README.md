# DanicaWebSite

基于 **Express 5 + Vue 3** 的全栈个人博客平台，支持文章 CRUD、评论、搜索、暗色模式、RSS 订阅。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Node.js >= 20.19.0 |
| 语言 | TypeScript |
| 后端框架 | Express 5（ESM） |
| 数据库 | MySQL 8.0（`mysql2` 连接池，原生 SQL） |
| 身份认证 | JWT（accessToken 1天 + refreshToken 7天） |
| 密码加密 | bcryptjs（10 轮） |
| 限流 | express-rate-limit（分级） |
| 前端框架 | Vue 3（Composition API + `<script setup>`） |
| 状态管理 | Pinia |
| 路由 | vue-router |
| UI 组件库 | Element Plus |
| 构建工具 | Vite |

---

## 项目结构

```
DanicaWebSite/
├── sql/                          # 数据库脚本
│   └── my_website.sql            # 完整建表 + 种子数据
├── API_Document.md               # API 接口速查
│
├── back/                         # 后端
│   ├── app.ts                    # 入口
│   ├── config/index.ts           # 环境变量
│   ├── type/index.ts             # TypeScript 类型定义
│   ├── database/
│   │   ├── index.ts              # MySQL2 连接池
│   │   └── DAO/
│   │       ├── auth.ts           # 用户数据访问
│   │       ├── article.ts        # 文章数据访问
│   │       └── comment.ts        # 评论数据访问
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑
│   │   ├── article.ts            # 文章业务逻辑
│   │   └── comment.ts            # 评论业务逻辑
│   ├── controllers/
│   │   ├── auth.ts               # 登录/注册/刷新Token
│   │   ├── article.ts            # 文章 CRUD
│   │   ├── comment.ts            # 评论 CRUD
│   │   ├── user.ts               # 用户资料
│   │   ├── upload.ts             # 文件上传
│   │   └── rss.ts                # RSS 订阅源
│   ├── routes/                   # 路由注册
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权
│   │   ├── response.ts           # 统一响应格式
│   │   ├── rateLimit.ts          # 分级限流
│   │   └── upload.ts             # multer 文件上传
│   └── utils/
│       ├── jwt.ts                # JWT 签发/验证
│       ├── bcrypt.ts             # 密码哈希
│       ├── response.ts           # JSON 响应工具
│       └── rateLimit.ts          # 限流器工厂
│
├── front/                        # 前端
│   └── src/
│       ├── main.ts               # 入口
│       ├── App.vue               # 根组件
│       ├── router/index.ts       # 路由 + 导航守卫
│       ├── stores/auth.ts        # Pinia 认证状态
│       ├── api/handleapi.ts      # API 封装（axios）
│       ├── styles/global.css     # 全局样式 + CSS 变量（亮/暗）
│       ├── utils/
│       │   ├── time.ts           # 时间格式化（timeAgo）
│       │   ├── tree.ts           # 评论平铺 → 树
│       │   └── highlight.ts      # 搜索关键词高亮
│       ├── components/
│       │   ├── AppLayout.vue     # 全局布局（导航栏 + 页脚 + 暗色切换）
│       │   ├── StateTip.vue      # 加载/空状态/错误 通用组件
│       │   ├── ArticleCard.vue   # 文章卡片（含高亮）
│       │   ├── CommentItem.vue   # 评论组件（递归）
│       │   └── CommentSection.vue# 评论区（含固定输入栏）
│       └── views/
│           ├── Home.vue           # 首页（精选文章）
│           ├── Articles.vue       # 文章列表（分页 + 搜索）
│           ├── ArticleDetail.vue  # 文章详情 + 评论区
│           ├── ArticleEditor.vue  # 文章编辑/发布
│           ├── MyArticles.vue     # 我的文章（草稿/已发布）
│           ├── Login.vue          # 登录
│           ├── Register.vue       # 注册
│           ├── Profile.vue        # 个人资料
│           └── NotFound.vue       # 404
```

---

## 数据库

完整建表脚本见 `sql/my_website.sql`。

### 表结构概览

**users** — 用户

| 列 | 类型 | 说明 |
|----|------|------|
| id | int PK | 自增 |
| username | varchar(50) UNIQUE | 用户名 |
| password | varchar(255) | bcrypt 哈希 |
| email | varchar(100) UNIQUE | 邮箱 |
| nickname | varchar(50) | 昵称 |
| avatar | varchar(500) | 头像路径 |
| created_at | timestamp | |
| updated_at | timestamp | ON UPDATE |

**articles** — 文章

| 列 | 类型 | 说明 |
|----|------|------|
| id | int PK | 自增 |
| title | varchar(200) | 标题 |
| content | text | 正文 |
| summary | varchar(500) | 摘要 |
| cover_image | varchar(500) | 封面图路径 |
| author_id | int FK → users | 作者 |
| view_count | int DEFAULT 0 | 阅读量 |
| status | enum(draft,published) | 状态 |
| created_at | timestamp | |
| updated_at | timestamp | ON UPDATE |

索引：`idx_author_id`, `idx_created_at`, `FULLTEXT ft_search(title, summary) WITH PARSER ngram`

**comments** — 评论

| 列 | 类型 | 说明 |
|----|------|------|
| id | int PK | 自增 |
| article_id | int FK → articles | 所属文章 |
| user_id | int FK → users | 评论者 |
| parent_id | int FK → comments | 父评论（null = 直接评论文章） |
| content | text | 内容 |
| created_at | timestamp | |
| updated_at | timestamp | ON UPDATE |

索引：`idx_article_id`, `idx_user_id`, `idx_parent_id`

外键级联：删除文章 → 删除所有评论；删除评论 → 删除所有子回复；删除用户 → 删除其文章和评论。

---

## 快速开始

### 1. 数据库

```bash
mysql -u root -p < sql/my_website.sql
```

### 2. 后端

```bash
cd back
cp .env.example .env   # 编辑数据库连接信息
npm install
npm run dev             # → http://localhost:3000
```

.env 关键变量：

| 变量 | 说明 |
|------|------|
| `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | MySQL 连接 |
| `JWT_SECRET` / `REFRESH_SECRET` | JWT 签名密钥 |
| `SITE_URL` / `SITE_TITLE` / `SITE_DESCRIPTION` | RSS 站点信息 |

### 3. 前端

```bash
cd front
npm install
npm run dev               # → http://localhost:5173
```

前端请求自动代理 `/api` 到 `http://localhost:3000`（Vite proxy）。

---

## 功能清单

- [x] 用户注册 / 登录 / 资料编辑
- [x] JWT 双 Token 鉴权 + 自动刷新
- [x] 文章 CRUD（草稿 / 发布状态）
- [x] 文章搜索（MySQL FULLTEXT + 前端关键词高亮）
- [x] 文章封面图
- [x] 嵌套评论（回复/删除/级联）
- [x] RSS 2.0 订阅源
- [x] 暗色模式（跟随系统 / 手动切换，localStorage 持久化）
- [x] 响应式布局（桌面 + 移动端）
- [x] API 分级限流
- [ ] 文章标签系统
- [ ] 文章点赞/收藏
- [ ] 通知系统
- [ ] AI 流式聊天
