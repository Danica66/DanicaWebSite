import api from "@/api"
export const authApi={
    login(data: { username: string; password: string }) {
    return api.Post('/auth/login', data);
    },
    register(data: { username: string; password: string }) {
        return api.Post('/auth/register', data);
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
};