# DanicaWebSite

基于 **Express 5 + Vue 3** 的全栈个人博客平台，含公开主站（front）与管理后台（front-manager），支持文章 CRUD、搜索、暗色模式、RSS 订阅、Docker Compose 部署。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Node.js >= 20.19.0 |
| 语言 | TypeScript |
| 后端框架 | Express 5（ESM，tsx 运行） |
| 数据库 | MySQL 8.0（`mysql2` 连接池，原生 SQL） |
| 身份认证 | JWT（accessToken 1h + refreshToken 7d 存 httpOnly Cookie，401 自动刷新） |
| 密码加密 | bcryptjs（10 轮） |
| 评论服务 | Giscus |
| 限流 | 自定义限流器（分级：auth / article / global） |
| 前端框架 | Vue 3（Composition API + `<script setup>`） |
| 状态管理 | Pinia |
| 路由 | vue-router |
| UI 组件库 | 主站：无（Tailwind CSS v4 毛玻璃设计系统）；管理台：Element Plus 全量引入 |
| 构建工具 | Vite |
| 容器化 | Docker Compose（3 容器 + MySQL，管理台独立 profile） |

---

## 项目结构

```
DanicaWebSite/
├── sql/                          # 数据库脚本
│   └── my_website.sql            # 建表 DDL
├── API_Document.md               # API 接口文档
├── README.md                     # 本文件
├── docker-compose.yml            # 部署配置
├── docker-compose.example.yml    # 部署配置模板
├── shared/
│   └── types.ts                  # 前后端共享的 API 契约类型
│
├── back/                         # 后端（端口 3000）
│   ├── app.ts                    # 入口：CORS / 响应包装 / JWT 鉴权 / 路由注册
│   ├── config/index.ts           # 环境变量
│   ├── type/index.ts             # TypeScript 类型定义
│   ├── database/
│   │   ├── index.ts              # MySQL2 连接池
│   │   └── DAO/
│   │       ├── auth.ts           # 用户数据访问
│   │       └── article.ts        # 文章数据访问
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑
│   │   └── article.ts            # 文章业务逻辑
│   ├── controllers/
│   │   ├── auth.ts               # 登录/刷新/个人资料
│   │   ├── article.ts            # 文章 CRUD
│   │   ├── upload.ts             # 图片上传
│   │   └── rss.ts                # RSS 订阅源
│   ├── routes/
│   │   ├── auth.ts               # POST /login /refresh
│   │   ├── articles.ts           # 公开文章路由
│   │   ├── articlesmanagerRoutes.ts  # 管理文章路由）
│   │   ├── user.ts               # 用户资料路由
│   │   ├── upload.ts             # 图片上传路由
│   │   └── rss.ts                # RSS 路由
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权 + 公开白名单
│   │   ├── response.ts           # 统一响应格式
│   │   └── rateLimit.ts          # 分级限流配置
│   ├── utils/
│   │   ├── jwt.ts                # JWT 签发/验证
│   │   ├── bcrypt.ts             # 密码哈希
│   │   ├── response.ts           # JSON 响应工具
│   │   └── rateLimit.ts          # 限流器工厂
│   └── tsconfig.json             # strict 类型检查
│
├── front/                        # 公开主站
│   └── src/
│       ├── main.ts / App.vue
│       ├── router/index.ts       # 路由
│       ├── styles/main.css       # Tailwind v4
│       ├── stores/theme.ts       # pinia
│       ├── api/
│       │   ├── index.ts          # axios 
│       │   └── article.ts        # 文章接口封装
│       ├── utils/
│       │   ├── highlight.ts      # 搜索关键词高亮
│       │   └── markdown.ts       # Markdown 渲染
│       ├── giscus/               # Giscus 评论主题
│       ├── components/
│       │   ├── AppLayout.vue     # 全局布局
│       │   ├── AppHeader.vue     # 顶部导航
│       │   ├── AppFooter.vue     # 页脚
│       │   ├── HeroSection.vue   # 首页全屏 Hero
│       │   ├── ArticleCard.vue   # 文章卡片
│       │   ├── SearchInput.vue   # 搜索输入框
│       │   ├── Pagination.vue    # 分页器
│       │   ├── StateTip.vue      # 加载 / 空 / 错 通用状态组件
│       │   └── Sidebar/
│       │       ├── SidebarLeft.vue   # 左侧边栏
│       │       ├── SidebarRight.vue  # 右侧边栏
│       │       ├── TagCloud.vue      # 标签云(后端未实现)
│       │       └── MusicPlayer.vue   # 音乐播放器(后端未实现)
│       └── views/
│           ├── Home.vue          # 首页
│           ├── Articles.vue      # 文章列表
│           ├── ArticleDetail.vue # 文章详情 + 上一篇/下一篇 + 评论区
│           └── NotFound.vue      # 404
│
└── front-manager/                # 管理后台
    └── src/
        ├── main.ts / App.vue
        ├── router/index.ts       # /login + 需登录的布局路由
        ├── stores/auth.ts        # Pinia 认证 + token 持久化
        ├── api/
        │   ├── index.ts          # axios 
        │   └── handleapi.ts      
        ├── types/index.ts        # 类型
        ├── utils/
        │   ├── highlight.ts      # 搜索关键词高亮
        │   └── markdown.ts       # Markdown 渲染
        ├── styles/global.css     # 全局样式 + CSS 变量
        ├── components/
        │   ├── AppLayout.vue     # 侧边导航
        │   ├── AppHeaderFooter.vue  # 顶部导航
        │   ├── ArticleEdit.vue   # 文章编辑表单
        │   ├── ArticleCard.vue   # 文章卡片
        │   └── AuthCard.vue      # 登录表单卡片
        └── views/
            ├── Login.vue         # 管理员登录
            ├── Home.vue          # 主页
            ├── Articles.vue      # 文章管理
            ├── ArticleEditor.vue # 写文章
            └── NotFound.vue      # 404
```

---

## 限流策略

| 路由 | 频率 | 说明 |
|------|------|------|
| `/admin/auth` | 1 分钟 5 次 | 登录/刷新，防暴力破解 |
| `/api/articles` | 15 分钟 100 次 | 公开文章读取，防爬虫 |
| `/api`（全局） | 15 分钟 200 次 | 兜底限流 |

---

## 快速开始

### 方式 1：Docker Compose（推荐）

```bash
cp docker-compose.example.yml docker-compose.yml
# 编辑 docker-compose.yml：
#   1. 修改 DB_PASSWORD / JWT_SECRET / REFRESH_SECRET / SITE_URL / ALLOWED_ORIGINS 等
#      （RESEND_API_KEY / MAIL_* 为历史残留变量，后端未使用，可删除）
#   2. 证书：front/ssl 与 front-manager/ssl 已放好 fullchain.pem / privkey.pem
#      （源文件在 danicablog.cn_nginx/，更换域名时同步替换）
docker compose up -d
# 管理后台（独立 profile，可选）
docker compose --profile admin up -d

# 可选：构建并推送镜像到 Docker Hub（根目录脚本）
npm run docker
```

端口分配：

| 服务 | 端口 | 说明 |
|------|------|------|
| front（主站） | 80 / 443 | HTTP / HTTPS |
| manager（管理台） | 8080 / 8443 | HTTP / HTTPS（需 `--profile admin`） |
| back（后端） | 3000 | 暴露到宿主机（nginx 容器内亦通过 back:3000 反代） |
| db（MySQL） | 3307 → 3306 | 宿主机 3307 |

> 管理台 API 通过 nginx `location /admin/` 转发到后端，**不经过主站**。
> 访问管理台时浏览器 origin 需在 `ALLOWED_ORIGINS` 中（如 `https://danicablog.cn:8443`），否则会被 CORS 拦截。

### 方式 2：本地开发

```bash
# 安装全部依赖（根 + front + back + front-manager）
npm run install:all

# 并行启动 后端 + 主站（后端 3000 / 主站 5173）
npm run dev

# 并行启动 后端 + 管理台（管理台 5173，与主站端口冲突时自动顺延 5174）
npm run test

# 也可分别单独启动：npm run dev:node / dev:vue / dev:manage
```

- 根目录 `npm run dev` 用 concurrently 同时启动后端与主站；`npm run test` 启动后端与管理台
- front 的 Vite 自动代理 `/api` → 3000；front-manager 的 Vite 自动代理 `/admin` → 3000
- 后端需要 `back/.env`（参考 `back/.env.example`：数据库连接、JWT 密钥、CORS、站点信息等；本地连 Docker MySQL 时 `DB_HOST=host.docker.internal`）

### 类型检查

```bash
cd back && npm run typecheck        # tsc --noEmit（strict）
cd front && npm run build           # 含 vue-tsc 类型检查
cd front-manager && npm run build   # 含 vue-tsc 类型检查
```

---

## 功能清单

- [x] JWT 双 Token 鉴权 + 401 自动刷新（refreshToken 存 httpOnly Cookie）
- [x] 管理台登录 / 退出登录
- [x] 文章 CRUD（草稿 / 发布，仅作者可编辑/删除）
- [x] 文章搜索（MySQL FULLTEXT + 前端关键词高亮）
- [x] 文章封面图 + 头像上传（管理台粘贴图片自动上传）
- [x] RSS 2.0 订阅源
- [x] 暗色模式（跟随系统 / 手动切换，localStorage 持久化）
- [x] 响应式布局（桌面 + 移动端）
- [x] API 分级限流
- [x] Docker Compose 一键部署（管理台独立 profile）
- [x] 主站毛玻璃风格 + Tailwind CSS v4（移除 Element Plus）
- [x] 主站侧边栏（站长信息 / 标签云占位 / 音乐播放器占位）
- [ ] 文章标签/分类（后端接口，主站标签云目前为静态占位）
- [ ] 管理台数据统计（文章数 / 阅读量汇总）
