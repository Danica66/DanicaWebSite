import api from "@/api"
export const authApi={
    login(data: { username: string; password: string }) {
    return api.Post('/auth/login', data);
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
    // noCount=1：管理台查看/编辑不增加阅读数（后端据此跳过 view_count+1）
    return api.Get(`/articles/${id}`, { noCount: '1' });
  },
  create(data: { title: string; content: string; summary?: string }) {
    return api.Post('/articles', data);
  },
  update(id: number, data: { title?: string; content?: string; summary?: string }) {
    return api.Put(`/articles/${id}`, data);
  },
  delete(id: number) {
    return api.Delete(`/articles/${id}`);
  },
  getMine(params: { page: number; limit: number; status?: string }) {
    return api.Get('/articles/mine', params);
  },
}

export const userApi = {
  getProfile() {
    return api.Get('/user/profile')
  },
  updateProfile(data: { email?: string; avatar?: string }) {
    return api.Put('/user/profile', data)
  },
}

// 图片上传：FormData，axios 自动设置 multipart 边界
export const uploadApi = {
  uploadImage(file: File) {
    const form = new FormData()
    form.append('image', file)
    return api.Post('/upload', form)
  },
}
