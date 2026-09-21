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

export function Get<T = unknown>(url: string, params = {}): Promise<ApiResponse<T>> {
  return instance.get(url, { params })
}

const api = { Get }
export default api
