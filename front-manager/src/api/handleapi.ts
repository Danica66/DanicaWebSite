import api from "@/api"
import type { ApiResponse, ArticlePayload, ArticleStatus } from "@/types"
import type { ArticleListResult, ArticleDetail, LoginParams, LoginResult, RefreshResult } from "@/types"

export const authApi = {
  login(data: LoginParams) {
    return api.Post<LoginResult>('/auth/login', data);
  },
  refresh() {
    return api.Post<RefreshResult>('/auth/refresh');
  },
  logout(token?: string) {
    return api.Post<ApiResponse<unknown>>('/auth/logout', {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  },
}

export const articleApi = {
  getList(params: { page: number; limit: number; keyword?: string, status?: ArticleStatus }) {
    return api.Get<ArticleListResult>('/articles', params);
  },
  getDetail(id: number) {
    // noCount=1：管理台查看/编辑不增加阅读数（后端据此跳过 view_count+1）
    return api.Get<ArticleDetail>(`/articles/${id}`, { noCount: '1' });
  },
  create(data: ArticlePayload) {
    return api.Post<ApiResponse<unknown>>('/articles', data);
  },
  update(id: number, data: ArticlePayload) {
    return api.Put<ApiResponse<unknown>>(`/articles/${id}`, data);
  },
  delete(id: number) {
    return api.Delete<ApiResponse<unknown>>(`/articles/${id}`);
  },
}

// 图片上传：FormData，axios 自动设置 multipart 边界
export const uploadApi = {
  uploadImage(file: File) {
    const form = new FormData()
    form.append('image', file)
    return api.Post<{ url: string }>('/upload', form)
  },
}
