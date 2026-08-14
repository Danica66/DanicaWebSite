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

// ===== 编辑弹窗表单 =====
export interface ArticleEditForm {
  id: number
  title: string
  content: string
  summary: string
  status: ArticleStatus
}

// ===== 认证 =====
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accesstoken: string
  refreshtoken: string
  userId: number
  username: string
  is_admin: number
}

export interface RefreshResult {
  accesstoken: string
}

// ===== 用户 =====
export interface UserProfile {
  id: number
  username: string
  email: string | null
  avatar: string | null
  email_verified: number
  created_at: string
}


// ===== 统一响应包装 =====
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}
