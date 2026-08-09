import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = parseInt(import.meta.env.VITE_TIMEOUT, 10) || 10000

const instance = axios.create({
  baseURL,
  timeout,
})

instance.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err),
)

export function Get(url: string, params = {}, config = {}) {
  return instance.get(url, { params, ...config })
}
export function Post(url: string, data = {}, config = {}) {
  return instance.post(url, data, config)
}
export function Put(url: string, data = {}, config = {}) {
  return instance.put(url, data, config)
}
export function Delete(url: string, config = {}) {
  return instance.delete(url, config)
}

const api = { Get, Post, Put, Delete }
export default api
