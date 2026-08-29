import api from './index'
import type { ArticleDetail, ArticleListResult } from '@shared/types'

export const articleApi = {
  getList(params: { page: number; limit: number; keyword?: string }) {
    return api.Get<ArticleListResult>('/articles', params)
  },
  getDetail(id: number) {
    return api.Get<ArticleDetail>(`/articles/${id}`)
  },
}
