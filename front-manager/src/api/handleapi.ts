import api from "@/api"
import type { ApiResponse, ArticlePayload, ArticleStatus } from "@/types"
import type { ArticleListResult, ArticleDetail, LoginParams, LoginResult, RefreshResult, UserProfile } from "@/types"

export const authApi = {
  login(data: LoginParams) {
    return api.Post<LoginResult>('/auth/login', data);
  },
  refresh(data: { refreshtoken: string }) {
    return api.Post<RefreshResult>('/auth/refresh', data);
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

export const userApi = {
  getProfile() {
    return api.Get<UserProfile>('/user/profile')
  },
  updateProfile(data: { email?: string; avatar?: string }) {
    return api.Put<ApiResponse<unknown>>('/user/profile', data)
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
