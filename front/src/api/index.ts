import axios from 'axios'
import type { ApiResponse } from '@shared/types'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = parseInt(import.meta.env.VITE_TIMEOUT, 10) || 10000

const instance = axios.create({
  baseURL,
  timeout,
})

// 只解包 data；错误交给调用方 catch（axios 默认即 reject，无需再包一层）
instance.interceptors.response.use((res) => res.data)

export function Get<T = unknown>(url: string, params = {}, config = {}): Promise<ApiResponse<T>> {
  return instance.get(url, { params, ...config })
}
export function Post<T = unknown>(url: string, data = {}, config = {}): Promise<ApiResponse<T>> {
  return instance.post(url, data, config)
}
export function Put<T = unknown>(url: string, data = {}, config = {}): Promise<ApiResponse<T>> {
  return instance.put(url, data, config)
}
export function Delete<T = unknown>(url: string, config = {}): Promise<ApiResponse<T>> {
  return instance.delete(url, config)
}

const api = { Get, Post, Put, Delete }
export default api
