// ===== 通用响应包装 =====
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// ===== 认证 =====
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accesstoken: string
  userId: number
  is_admin: number
}

export interface RefreshResult {
  accesstoken: string
}

// JWT 载荷（后端解析 token 后挂到 req.user）
export interface UserPayload {
  userId: number
  jti: string
}

// ===== 用户 =====
// 完整用户资料（响应体）
export interface UserProfile {
  id: number
  username: string
  email: string | null
  avatar: string | null
  email_verified: number
  created_at: string
}

// 用户资料更新请求体
export interface UserProfileUpdate {
  email?: string
  avatar?: string
}

// ===== 文章 =====
export type ArticleStatus = 'draft' | 'published'

// 列表项（后端列表接口不返回 content/status）
export interface ArticleListItem {
  id: number
  title: string
  summary: string | null
  cover_image: string | null
  author_id: number
  view_count: number
  created_at: string
}

// 文章详情（getDetail 返回，含 content/status）
export interface ArticleDetail extends ArticleListItem {
  content: string
  status: ArticleStatus
  updated_at: string
}

// 文章列表分页结果
export interface ArticleListResult {
  list: ArticleListItem[]
  total: number
}

// 创建/更新文章请求体
export interface ArticlePayload {
  title: string
  content: string
  summary?: string
  cover_image?: string
  status?: ArticleStatus
}

// 文章实体（后端业务层使用，含 author_id 与数据库字段）
export interface Article {
  id?: number
  title: string
  status?: ArticleStatus
  content: string
  summary?: string
  cover_image?: string
  author_id: number
  view_count?: number
  created_at?: string
  updated_at?: string
  tag?: string
}
