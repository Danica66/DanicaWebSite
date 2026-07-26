# 认证
POST   /api/auth/login          # 登录
POST   /api/auth/register       # 注册
POST   /api/auth/refresh        # 刷新 Token

# 文章（公开）
GET    /api/articles            # 文章列表（仅已发布）?page=&limit=&keyword=
GET    /api/articles/:id        # 文章详情（自动增加阅读量）
GET    /api/rss                 # RSS 订阅源（XML）

# 文章（需登录）
GET    /api/articles/mine              # 我的文章 ?status=draft|published
POST   /api/articles                   # 发布文章 status 不传=草稿，status=published=发布
PUT    /api/articles/:id               # 更新文章（含发布草稿：status=published）
DELETE /api/articles/:id               # 删除文章
