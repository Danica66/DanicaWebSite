// 公共 API 契约类型统一来自根目录 shared/types.ts
import type { ArticleStatus } from '@shared/types'
export * from '@shared/types'

// ===== 编辑弹窗表单（UI 专用，不进入共享层） =====
export interface ArticleEditForm {
  id: number
  title: string
  content: string
  summary: string
  status: ArticleStatus
  tag: string
}
