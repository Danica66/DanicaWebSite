import { authApi } from "@/api/handleapi"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

const ACCESSTOKEN_KEY = 'accesstoken'

export const useauthStore = defineStore('userLogin', () => {
  const accesstoken = ref(localStorage.getItem(ACCESSTOKEN_KEY) || '')
  const isLogin = computed(() => !!accesstoken.value)

  const login = async (username: string, password: string) => {
    const res = await authApi.login({ username, password })
    const data = res.data
    accesstoken.value = data.accesstoken
    localStorage.setItem(ACCESSTOKEN_KEY, data.accesstoken)
    return data.is_admin
  }

  const refresh = async () => {
    const res = await authApi.refresh()
    accesstoken.value = res.data.accesstoken
    localStorage.setItem(ACCESSTOKEN_KEY, res.data.accesstoken)
  }

  const logout = () => {
    // 先清本地状态，再异步通知后端删 cookie 并注销旧 access token（带旧 token，后端才能写黑名单）
    const token = accesstoken.value
    accesstoken.value = ''
    localStorage.removeItem(ACCESSTOKEN_KEY)
    if (token) {
      authApi.logout(token).catch(() => {})
    }
  }

  return {
    accesstoken,
    isLogin,
    login, refresh, logout,
  }
})
