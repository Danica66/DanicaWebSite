import api from "@/api"
export const authApi={
    login(data: { username: string; password: string }) {
        return api.Post('/auth/login', data);
    },
    register(data: { username: string; password: string; email: string; code: string }) {
        return api.Post('/auth/register', data);
    },
    sendCode(data: { email: string }) {
        return api.Post('/auth/send-code', data);
    },
    refresh(data: { refreshtoken: string }) {
        return api.Post('/auth/refresh', data);
    },
}

export const articleApi = {
  getList(params: { page: number; limit: number; keyword?: string }) {
    return api.Get('/articles', params);
  },
  getDetail(id: number) {
    return api.Get(`/articles/${id}`);
  },
}

export const userApi = {
  getProfile() {
    return api.Get('/user/profile')
  },
  updateProfile(data: { email?: string; avatar?: string; code?: string }) {
    return api.Put('/user/profile', data)
  },
  sendCode(email: string) {
    return api.Post('/user/send-code', { email })
  },
}

export const uploadApi = {
  uploadAvatar(file: File) {
    const form = new FormData()
    form.append('file', file, file.name)
    return api.Post('/upload', form)
  },
}

export const commentApi = {
  getList(articleId: number) {
    return api.Get(`/articles/${articleId}/comments`)
  },
  create(articleId: number, data: { content: string; parent_id?: number | null }) {
    return api.Post(`/articles/${articleId}/comments`, data)
  },
  delete(commentId: number) {
    return api.Delete(`/comments/${commentId}`)
  },
}
