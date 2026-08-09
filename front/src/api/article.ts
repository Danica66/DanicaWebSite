import api from './index'

export const articleApi = {
  getList(params: { page: number; limit: number; keyword?: string }) {
    return api.Get('/articles', params)
  },
  getDetail(id: number) {
    return api.Get(`/articles/${id}`)
  },
}
