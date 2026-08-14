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
| 身份认证 | JWT（accessToken 1h + refreshToken 7d，401 自动刷新） |
| 密码加密 | bcryptjs（10 轮） |
| 评论服务 | Giscus |
| 限流 | 自定义限流器（分级：auth / article / global） |
| 前端框架 | Vue 3（Composition API + `<script setup>`） |
| 状态管理 | Pinia |
| 路由 | vue-router |
| UI 组件库 | Element Plus（front 按需引入，front-manager 全量引入） |
| 构建工具 | Vite |
| 容器化 | Docker Compose（3 容器 + MySQL，管理台独立 profile） |

---

## 项目结构

```
DanicaWebSite/
├── sql/                          # 数据库脚本
│   └── my_website.sql            # 建表 DDL（首次启动自动执行）
├── API_Document.md               # API 接口文档（/api 公开 + /admin 管理双前缀）
├── README.md                     # 本文件
├── docker-compose.yml            # 部署配置（db / back / front / manager）
├── docker-compose.example.yml    # 部署配置模板（占位密码）
│
├── back/                         # 后端（端口 3000）
│   ├── app.ts                    # 入口：CORS / 响应包装 / JWT 鉴权 / 路由注册
│   ├── config/index.ts           # 环境变量（dotenv）
│   ├── type/index.ts             # TypeScript 类型定义
│   ├── database/
│   │   ├── index.ts              # MySQL2 连接池
│   │   └── DAO/
│   │       ├── auth.ts           # 用户数据访问
│   │       └── article.ts        # 文章数据访问（含阅读数 / RSS）
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑（登录/刷新/资料）
│   │   └── article.ts            # 文章业务逻辑（列表/详情/增删改）
│   ├── controllers/
│   │   ├── auth.ts               # 登录/刷新/个人资料
│   │   ├── article.ts            # 文章 CRUD（公开 + 管理双入口）
│   │   ├── upload.ts             # 图片上传（multer，限制 5MB）
│   │   └── rss.ts                # RSS 订阅源
│   ├── routes/
│   │   ├── auth.ts               # POST /login /refresh（挂载于 /admin/auth）
│   │   ├── articles.ts           # 公开文章路由（挂载于 /api/articles）
│   │   ├── articlesmanagerRoutes.ts  # 管理文章路由（挂载于 /admin/articles）
│   │   ├── user.ts               # 用户资料路由（挂载于 /admin/user）
│   │   ├── upload.ts             # 图片上传路由（挂载于 /admin/upload）
│   │   └── rss.ts                # RSS 路由（挂载于 /api/rss）
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权 + 公开白名单
│   │   ├── response.ts           # 统一响应格式（res.success / res.error）
│   │   └── rateLimit.ts          # 分级限流配置
│   ├── utils/
│   │   ├── jwt.ts                # JWT 签发/验证
│   │   ├── bcrypt.ts             # 密码哈希
│   │   ├── response.ts           # JSON 响应工具
│   │   └── rateLimit.ts          # 限流器工厂
│   └── tsconfig.json             # strict 类型检查（npm run typecheck）
│
├── front/                        # 公开主站（Vite 代理 /api → 3000）
│   └── src/
│       ├── main.ts / App.vue
│       ├── router/index.ts       # 路由 + 导航守卫
│       ├── stores/
│       │   ├── auth.ts           # Pinia 认证状态
│       │   └── theme.ts          # 暗色模式状态（AppLayout 与详情页同步）
│       ├── api/handleapi.ts      # API 封装
│       ├── styles/global.css     # 全局样式 + CSS 变量（亮/暗）
│       ├── utils/
│       │   ├── highlight.ts      # 搜索关键词高亮
│       │   └── markdown.ts       # Markdown 渲染
│       ├── giscus/               # 评论区（Giscus 组件）
│       ├── components/
│       │   ├── AppLayout.vue     # 全局布局（导航 + 页脚）
│       │   ├── ArticleCard.vue   # 文章卡片（含高亮）
│       │   ├── AuthCard.vue      # 登录表单卡片
│       │   └── StateTip.vue      # 加载/空/错 通用状态组件
│       └── views/
│           ├── Home.vue          # 首页
│           ├── Articles.vue      # 文章列表（分页 + 搜索）
│           ├── ArticleDetail.vue # 文章详情 + 评论区
│           └── NotFound.vue      # 404
│
└── front-manager/                # 管理后台（Vite 代理 /admin → 3000，Docker profile: admin）
    └── src/
        ├── main.ts / App.vue
        ├── router/index.ts       # /login + 需登录的布局路由（导航守卫）
        ├── stores/auth.ts        # Pinia 认证 + token 持久化
        ├── api/
        │   ├── index.ts          # axios 实例（baseURL /admin、401 自动刷新）
        │   └── handleapi.ts      # authApi / articleApi / userApi / uploadApi
        ├── types/index.ts        # 文章/认证/用户类型定义
        ├── styles/global.css     # 全局样式 + CSS 变量（亮/暗）
        ├── components/
        │   ├── AppLayout.vue     # 侧边导航（文章管理）
        │   ├── AppHeaderFooter.vue  # 顶部导航（主题切换 + 退出登录）
        │   ├── ArticleEdit.vue   # 文章编辑表单（写文章页 + 编辑弹窗复用）
        │   ├── ArticleCard.vue   # 文章卡片
        │   └── AuthCard.vue      # 登录表单卡片
        └── views/
            ├── Login.vue         # 管理员登录
            ├── Home.vue          # 主页（欢迎页）
            ├── Articles.vue      # 文章管理（列表/搜索/编辑弹窗/删除）
            ├── ArticleEditor.vue # 写文章（Markdown + 粘贴图片自动上传）
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
#   2. 证书：front/ssl 与 front-manager/ssl 需放好 fullchain.pem / privkey.pem
docker compose up -d
# 管理后台（独立 profile，可选）
docker compose --profile admin up -d
```

端口分配：

| 服务 | 端口 | 说明 |
|------|------|------|
| front（主站） | 80 / 443 | HTTP / HTTPS |
| manager（管理台） | 8080 / 8443 | HTTP / HTTPS（需 `--profile admin`） |
| back（后端） | 3000 | 仅容器内访问（nginx 反向代理） |
| db（MySQL） | 3307 → 3306 | 宿主机 3307 |

> 管理台 API 通过 nginx `location /admin/` 转发到后端，**不经过主站**。
> 访问管理台时浏览器 origin 需在 `ALLOWED_ORIGINS` 中（如 `https://danicablog.cn:8443`），否则会被 CORS 拦截。

### 方式 2：本地开发

```bash
# 安装依赖（根目录 + front + back + front-manager）
npm install
cd front && npm install
cd ../back && npm install
cd ../front-manager && npm install

# 启动（三端并行，各自终端运行）
cd back && npm run dev          # 后端 → http://localhost:3000
cd front && npm run dev         # 主站 → http://localhost:5173
cd front-manager && npm run dev # 管理台 → http://localhost:5173（与主站端口冲突时 Vite 自动顺延 5174）
```

- front 的 Vite 自动代理 `/api` → 3000；front-manager 的 Vite 自动代理 `/admin` → 3000
- 后端需要 `.env`（数据库连接、JWT 密钥等，参考 docker-compose 环境变量）

### 类型检查

```bash
cd back && npm run typecheck        # tsc --noEmit（strict）
cd front-manager && npm run build   # 含 vue-tsc 类型检查
```

---

## 功能清单

- [x] JWT 双 Token 鉴权 + 401 自动刷新
- [x] 管理台登录 / 退出登录
- [x] 文章 CRUD（草稿 / 发布，仅作者可编辑/删除）
- [x] 文章搜索（MySQL FULLTEXT + 前端关键词高亮）
- [x] 文章封面图 + 头像上传（管理台粘贴图片自动上传）
- [x] RSS 2.0 订阅源
- [x] 暗色模式（跟随系统 / 手动切换，localStorage 持久化）
- [x] 响应式布局（桌面 + 移动端）
- [x] API 分级限流
- [x] Docker Compose 一键部署（管理台独立 profile）
- [ ] 文章标签/分类
- [ ] 添加侧边栏站长信息
- [ ] 管理台数据统计（文章数 / 阅读量汇总）
