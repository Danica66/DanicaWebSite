# DanicaWebSite

一个基于 **Express 5 + Vue 3** 的全栈个人博客网站，支持用户注册登录、文章的发布/编辑/删除（含草稿状态），以及 RSS 订阅。

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 运行时 | Node.js | `^20.19.0 \|\| >=22.12.0` |
| 语言 | TypeScript | v7.0.2 |
| 后端框架 | Express 5 | ESM，`"type": "module"` |
| 数据库 | MySQL | 通过 `mysql2` 连接池，原生 SQL |
| 身份认证 | JWT | accessToken (1天) + refreshToken (7天) |
| 密码加密 | bcryptjs | 加盐轮数 10 |
| 限流 | express-rate-limit | 分级限流（登录 5次/分，文章 100次/15分，全局 200次/15分） |
| 前端框架 | Vue 3 | Composition API + `<script setup>` |
| 状态管理 | Pinia | v3.0.4 |
| 路由 | vue-router | v5.0.2 |
| 构建工具 | Vite | v7.3.1 |

---

## 项目结构

```
DanicaWebSite/
├── back/                         # 后端 — Express 5 API 服务
│   ├── app.ts                    # 入口文件
│   ├── config/
│   │   └── index.ts              # 服务端/JWT/数据库/bcrypt/站点 配置
│   ├── controllers/
│   │   ├── auth.ts               # 登录/注册/刷新Token 控制器
│   │   ├── article.ts            # 文章 CRUD + 我的文章 控制器
│   │   └── rss.ts                # RSS 订阅源 控制器
│   ├── routes/
│   │   ├── auth.ts               # /api/auth/*
│   │   ├── articles.ts           # /api/articles/*
│   │   ├── rss.ts                # /api/rss
│   │   └── chat.ts               # /api/chat/stream (暂未启用)
│   ├── middleware/
│   │   ├── auth.ts               # JWT 鉴权中间件（含公开路由白名单）
│   │   ├── response.ts           # 统一响应格式中间件
│   │   └── rateLimit.ts          # API 限流中间件
│   ├── service/
│   │   ├── auth.ts               # 认证业务逻辑
│   │   └── article.ts            # 文章业务逻辑（含所有权校验）
│   ├── database/
│   │   ├── index.ts              # MySQL2 连接池
│   │   └── DAO/
│   │       ├── auth.ts           # 用户表数据访问
│   │       └── article.ts        # 文章表数据访问
│   ├── type/
│   │   └── index.ts              # 类型定义 + Express 类型增强
│   └── utils/
│       ├── jwt.ts                # JWT 签发/验证
│       ├── bcrypt.ts             # 密码哈希/比对
│       ├── response.ts           # 统一 JSON 响应工具
│       └── rateLimit.ts          # 限流器工厂函数
│
├── front/                        # 前端 — Vue 3 + Vite
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts               # 应用入口
│       ├── App.vue               # 根组件
│       ├── router/               # 路由配置
│       └── stores/               # Pinia 状态管理
│
└── API_Document                  # API 接口速查表
```

---

## API 接口

所有接口前缀为 `/api`，基础地址 `http://localhost:3000`。

### 认证

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/api/auth/login` | 否（限流 5次/分） | 登录，返回 accesstoken + refreshtoken |
| POST | `/api/auth/register` | 否（限流 5次/分） | 注册新用户 |
| POST | `/api/auth/refresh` | 否 | 刷新 accesstoken |

### 文章（公开）

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/articles` | 否 | 文章列表（仅已发布），`?page=&limit=&keyword=` |
| GET | `/api/articles/:id` | 是 | 文章详情（阅读量 +1） |
| GET | `/api/rss` | 否 | RSS 2.0 订阅源（XML） |

### 文章（需登录）

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/articles/mine` | 是 | 我的文章，`?status=draft` 只看草稿 |
| POST | `/api/articles` | 是 | 发布文章，`status` 不传 = 草稿，`"published"` = 直接发布 |
| PUT | `/api/articles/:id` | 是 | 更新文章，可改 `status` 将草稿发布 |
| DELETE | `/api/articles/:id` | 是 | 删除文章（仅作者可删） |

### 统一响应格式

```json
// 成功
{ "code": 200, "data": {...}, "message": "操作成功" }

// 失败
{ "code": 400, "message": "错误描述", "data": null }
```

---

## 快速开始

### 前置条件

- Node.js >= 20.19.0
- MySQL 数据库
- npm

### 1. 克隆项目

```bash
git clone <repo-url>
cd DanicaWebSite
```

### 2. 启动后端

```bash
cd back
npm install
```

在 `back/` 目录下创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=my_website

JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
BCRYPT_SALT_ROUNDS=10

# RSS / 站点信息（可选）
SITE_URL=http://localhost:5173
SITE_TITLE=DanicaWebSite
SITE_DESCRIPTION=一个个人博客
```

启动开发服务器：

```bash
npm run dev
# → http://localhost:3000
```

### 3. 启动前端

```bash
cd front
npm install
npm run dev
# → http://localhost:5173
```

---

## 数据库

### 建表

```sql
CREATE DATABASE my_website DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE my_website;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500),
  author_id INT NOT NULL,
  view_count INT DEFAULT 0,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 后端服务端口 |
| `NODE_ENV` | `development` | 运行环境 |
| `DB_HOST` | `localhost` | MySQL 地址 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_USERNAME` | `root` | MySQL 用户名 |
| `DB_PASSWORD` | `1234` | MySQL 密码 |
| `DB_DATABASE` | `my_website` | 数据库名 |
| `JWT_SECRET` | `danicasecretkey` | JWT 签名密钥 |
| `REFRESH_SECRET` | `danicarefreshsecretkey` | RefreshToken 签名密钥 |
| `BCRYPT_SALT_ROUNDS` | `10` | bcrypt 加盐轮数 |
| `SITE_URL` | `http://localhost:5173` | 站点 URL（RSS 文章链接前缀） |
| `SITE_TITLE` | `DanicaWebSite` | 站点标题（RSS 频道名） |
| `SITE_DESCRIPTION` | `一个个人博客` | 站点描述 |

---

## 功能清单

- [x] 用户注册 / 登录
- [x] JWT 双 Token 鉴权（accessToken + refreshToken）
- [x] API 分级限流（登录严格 / 文章中等 / 全局兜底）
- [x] 统一响应格式（code + data + message）
- [x] 文章列表（分页 + 关键词搜索，仅已发布）
- [x] 文章详情（自动增加阅读量）
- [x] 文章草稿 / 发布状态
- [x] 文章所有权校验（仅作者可改删）
- [x] RSS 2.0 订阅源
- [x] 我的文章列表（含草稿筛选）
- [ ] 文章 Slug（URL 友好标识）
- [ ] 文章标签系统
- [ ] AI 流式聊天（SSE）
- [ ] 前端页面
