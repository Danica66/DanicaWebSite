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
| 身份认证 | JWT（accessToken 1h + refreshToken 7d） |
| 密码加密 | bcryptjs（10 轮） |
| 评论服务 | Giscus |
| 限流 | 自定义限流器（分级：auth / article / global） |
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
│   └── my_website.sql            # 建表 DDL
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
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑（含验证码发送/校验）
│   │   ├── article.ts            # 文章业务逻辑
│   ├── controllers/
│   │   ├── auth.ts               # 登录/注册/刷新/发送验证码/个人资料
│   │   ├── article.ts            # 文章 CRUD
│   │   └── rss.ts                # RSS 订阅源
│   ├── routes/                   # 路由注册
│   │   ├── auth.ts
│   │   ├── articles.ts
│   │   ├── user.ts
│   │   ├── rss.ts
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权（全局限流白名单）
│   │   ├── response.ts           # 统一响应格式 + res.error()
│   │   ├── rateLimit.ts          # 分级限流配置
│   └── utils/
│       ├── jwt.ts                # JWT 签发/验证
│       ├── bcrypt.ts             # 密码哈希
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
│       │   ├── highlight.ts      # 搜索关键词高亮
│       │   ├── markdown.ts       # 文章使用markdown
│       ├── components/
│       │   ├── AppLayout.vue     # 全局布局
│       │   ├── StateTip.vue      # 加载/空/错 通用状态组件
│       │   ├── ArticleCard.vue   # 文章卡片（含高亮）
│       └── views/
│           ├── Home.vue          # 首页
│           ├── Articles.vue      # 文章列表（分页 + 搜索）
│           ├── ArticleDetail.vue # 文章详情 + 评论区
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

## 限流策略

| 路由 | 频率 | 说明 |
|------|------|------|
| `/api/articles` | 15 分钟 100 次 | 公开文章读取 |
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

- [x] JWT 双 Token 鉴权 + 401 自动刷新
- [x] 文章 CRUD（草稿 / 发布，仅作者可编辑/删除）
- [x] 文章搜索（MySQL FULLTEXT + 前端关键词高亮）
- [x] 文章封面图 + 头像上传
- [x] RSS 2.0 订阅源
- [x] 暗色模式（跟随系统 / 手动切换，localStorage 持久化）
- [x] 响应式布局（桌面 + 移动端）
- [x] API 分级限流
- [x] Docker Compose 一键部署
- [x] 管理后台（独立容器，admin profile）
- [ ] 文章标签/分类
- [ ] 添加侧边栏站长信息
