import { authApi } from "@/api/handleapi"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

const localstorageKey = {
  accesstoken: 'accesstoken',
  user: 'user',
}

export const useauthStore = defineStore('userLogin', () => {
  const accesstoken = ref(localStorage.getItem(localstorageKey.accesstoken) || '')
  const stored = localStorage.getItem(localstorageKey.user)
  const user = ref(stored ? JSON.parse(stored) : null)

  const isLogin = computed(() => !!accesstoken.value)
  const userId = computed(() => user.value?.id || '')
  const username = computed(() => user.value?.name || '')
  const isAdmin = computed(() => !!user.value?.isAdmin)

  const login = async (username: string, password: string) => {
    const res = await authApi.login({ username, password })
    const data = res.data
    accesstoken.value = data.accesstoken
    user.value = { id: data.userId, name: data.username, isAdmin: data.is_admin }
    localStorage.setItem(localstorageKey.accesstoken, data.accesstoken)
    localStorage.setItem(localstorageKey.user, JSON.stringify(user.value))
    return data.is_admin
  }

  const refresh = async () => {
    const res = await authApi.refresh()
    accesstoken.value = res.data.accesstoken
    localStorage.setItem(localstorageKey.accesstoken, res.data.accesstoken)
  }

  const logout = () => {
    // 先清本地状态，再异步通知后端删 cookie；后端不可达时登出也不应阻塞
    accesstoken.value = ''
    user.value = null
    localStorage.removeItem(localstorageKey.accesstoken)
    localStorage.removeItem(localstorageKey.user)
    authApi.logout().catch(() => {})
  }

  return {
    accesstoken, user,
    isLogin, userId, username, isAdmin,
    login, refresh, logout,
  }
})
