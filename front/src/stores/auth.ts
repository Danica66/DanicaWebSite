import { authApi } from "@/api/handleapi"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

const localstorageKey = {
  accesstoken: 'accesstoken',
  refreshtoken: 'refreshtoken',
  user: 'user',
}

export const useauthStore = defineStore('userLogin', () => {
  const accesstoken = ref(localStorage.getItem(localstorageKey.accesstoken) || '')
  const refreshtoken = ref(localStorage.getItem(localstorageKey.refreshtoken) || '')
  const stored = localStorage.getItem(localstorageKey.user)
  const user = ref(stored ? JSON.parse(stored) : null)

  const isLogin = computed(() => !!accesstoken.value)
  const userId = computed(() => user.value?.id || '')
  const username = computed(() => user.value?.name || '')

  const login = async (username: string, password: string) => {
    const res = await authApi.login({ username, password })
    const data = res.data
    accesstoken.value = data.accesstoken
    refreshtoken.value = data.refreshtoken
    user.value = { id: data.userId, name: data.username }
    localStorage.setItem(localstorageKey.accesstoken, data.accesstoken)
    localStorage.setItem(localstorageKey.refreshtoken, data.refreshtoken)
    localStorage.setItem(localstorageKey.user, JSON.stringify(user.value))
  }

  const register = async (username: string, password: string, email: string, code: string) => {
    await authApi.register({ username, password, email, code })
    // 注册成功自动登录
    await login(username, password)
  }

  const sendCode = async (email: string) => {
    await authApi.sendCode({ email })
  }

  const refresh = async () => {
    const res = await authApi.refresh({ refreshtoken: refreshtoken.value })
    accesstoken.value = res.data.accesstoken
    localStorage.setItem(localstorageKey.accesstoken, res.data.accesstoken)
  }

  const logout = () => {
    accesstoken.value = ''
    refreshtoken.value = ''
    user.value = null
    localStorage.removeItem(localstorageKey.accesstoken)
    localStorage.removeItem(localstorageKey.refreshtoken)
    localStorage.removeItem(localstorageKey.user)
  }

  return {
    accesstoken, refreshtoken, user,
    isLogin, userId, username,
    login, register, sendCode, refresh, logout,
  }
})
