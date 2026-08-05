# DanicaWebSite

基于 **Express 5 + Vue 3** 的全栈个人博客平台，支持文章 CRUD、评论、搜索、暗色模式、RSS 订阅、邮箱验证。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Node.js >= 20.19.0 |
| 语言 | TypeScript |
| 后端框架 | Express 5（ESM） |
| 数据库 | MySQL 8.0（`mysql2` 连接池，原生 SQL） |
| 身份认证 | JWT（accessToken 1h + refreshToken 7d） |
| 密码加密 | bcryptjs（10 轮） |
| 邮件服务 | Resend |
| 限流 | 自定义限流器（分级：auth / article / comment / global） |
| 前端框架 | Vue 3（Composition API + `<script setup>`） |
| 状态管理 | Pinia |
| 路由 | vue-router |
| UI 组件库 | Element Plus |
| 构建工具 | Vite |
| 容器化 | Docker Compose |

---

## 项目结构

```
DanicaWebSite/
├── sql/                          # 数据库脚本
│   └── my_website.sql            # 建表 DDL（不含种子数据）
├── API_Document.md               # API 接口文档
├── README.md                     # 本文件
├── docker-compose.example.yml    # 部署配置模板
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
│   │       ├── comment.ts        # 评论数据访问
│   │       └── emailCode.ts      # 邮箱验证码数据访问
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑（含验证码发送/校验）
│   │   ├── article.ts            # 文章业务逻辑
│   │   └── comment.ts            # 评论业务逻辑
│   ├── controllers/
│   │   ├── auth.ts               # 登录/注册/刷新/发送验证码/个人资料
│   │   ├── article.ts            # 文章 CRUD
│   │   ├── comment.ts            # 评论 CRUD
│   │   ├── upload.ts             # 文件上传
│   │   └── rss.ts                # RSS 订阅源
│   ├── routes/                   # 路由注册
│   │   ├── auth.ts
│   │   ├── articles.ts
│   │   ├── user.ts
│   │   ├── rss.ts
│   │   ├── upload.ts
│   │   └── comment.ts
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权（全局限流白名单）
│   │   ├── response.ts           # 统一响应格式 + res.error()
│   │   ├── rateLimit.ts          # 分级限流配置
│   │   └── upload.ts             # multer 文件上传（扩展名白名单）
│   └── utils/
│       ├── jwt.ts                # JWT 签发/验证
│       ├── bcrypt.ts             # 密码哈希
│       ├── mailer.ts             # Resend 邮件发送
│       ├── response.ts           # JSON 响应工具
│       └── rateLimit.ts          # 限流器工厂
│
├── front/                        # 公开前端
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/index.ts       # 路由 + 导航守卫
│       ├── stores/auth.ts        # Pinia 认证状态
│       ├── api/handleapi.ts      # API 封装
│       ├── styles/global.css     # 全局样式 + CSS 变量（亮/暗）
│       ├── utils/
│       │   ├── time.ts           # 时间格式化（timeAgo）
│       │   ├── tree.ts           # 评论平铺 → 树
│       │   ├── highlight.ts      # 搜索关键词高亮
│       │   ├── error.ts          # getErrMsg 错误提取
│       │   └── format.ts         # formatDate 日期格式化
│       ├── components/
│       │   ├── AppLayout.vue     # 全局布局
│       │   ├── AuthCard.vue      # 认证卡片壳
│       │   ├── StateTip.vue      # 加载/空/错 通用状态组件
│       │   ├── SendCodeField.vue # 邮箱 + 验证码输入（可复用）
│       │   ├── ArticleCard.vue   # 文章卡片（含高亮）
│       │   ├── CommentItem.vue   # 评论项（递归）
│       │   └── CommentSection.vue# 评论区（含固定输入栏）
│       └── views/
│           ├── Home.vue          # 首页
│           ├── Articles.vue      # 文章列表（分页 + 搜索）
│           ├── ArticleDetail.vue # 文章详情 + 评论区
│           ├── Login.vue         # 登录
│           ├── Register.vue      # 注册（邮箱验证码）
│           ├── Profile.vue       # 个人资料（换邮箱需验证码）
│           └── NotFound.vue      # 404
│
└── front-manager/                # 后台管理（profile: admin）
    └── src/
        ├── views/
        │   ├── ArticleEditor.vue # 文章编辑/发布
        │   ├── Login.vue         # 管理员登录
        │   └── ...
        └── components/
            └── ...
```

---

## 数据库表

| 表 | 说明 |
|----|------|
| `users` | 用户（username, password, email, avatar, email_verified, is_admin） |
| `email_codes` | 邮箱验证码（email, code, expires_at, attempts, used） |
| `articles` | 文章（title, content, summary, cover_image, status, view_count, FULLTEXT 索引） |
| `comments` | 评论（article_id, user_id, parent_id, content, 级联删除） |

建表脚本：`sql/my_website.sql`

---

## 限流策略

| 路由 | 频率 | 说明 |
|------|------|------|
| `/api/auth` | 1 分钟 5 次 | 登录/注册/发送验证码 |
| `/api/articles` | 15 分钟 100 次 | 公开文章读取 |
| `/api`（评论） | 1 分钟 10 次 | 发表/删除评论 |
| `/api`（全局） | 15 分钟 200 次 | 兜底限流 |

---

## 快速开始

### 方式 1：Docker Compose（推荐）

```bash
cp docker-compose.example.yml docker-compose.yml
# 编辑 docker-compose.yml 填入数据库密码、JWT 密钥、Resend API Key 等
docker compose up -d
# 管理后台（可选）
docker compose --profile admin up -d
```

### 方式 2：本地开发

```bash
npm run install:all          # 安装所有依赖
cd back && cp .env.example .env   # 编辑数据库连接信息
cd .. && npm run dev         # 一键启动前后端
# 后端 → http://localhost:3000
# 前端 → http://localhost:5173
```

> 前端 Vite 自动代理 `/api` 请求到后端 3000 端口。

---

## 功能清单

- [x] 用户注册（邮箱验证码）/ 登录 / 自动登录
- [x] 个人资料编辑（换邮箱需再次验码）
- [x] JWT 双 Token 鉴权 + 401 自动刷新
- [x] 文章 CRUD（草稿 / 发布，仅作者可编辑/删除）
- [x] 文章搜索（MySQL FULLTEXT + 前端关键词高亮）
- [x] 文章封面图 + 头像上传
- [x] 嵌套评论（回复 / 删除，级联删除）
- [x] RSS 2.0 订阅源
- [x] 暗色模式（跟随系统 / 手动切换，localStorage 持久化）
- [x] 响应式布局（桌面 + 移动端）
- [x] API 分级限流
- [x] Docker Compose 一键部署
- [x] 管理后台（独立容器，admin profile）
- [ ] 文章标签/分类
- [ ] 评论回复邮件通知
- [ ] 密码重置
