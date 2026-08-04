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
  const isAdmin = computed(() => !!user.value?.isAdmin)

  const login = async (username: string, password: string) => {
    const res = await authApi.login({ username, password })
    const data = res.data
    accesstoken.value = data.accesstoken
    refreshtoken.value = data.refreshtoken
    user.value = { id: data.userId, name: data.username, isAdmin: data.is_admin }
    localStorage.setItem(localstorageKey.accesstoken, data.accesstoken)
    localStorage.setItem(localstorageKey.refreshtoken, data.refreshtoken)
    localStorage.setItem(localstorageKey.user, JSON.stringify(user.value))
    return data.is_admin
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
    isLogin, userId, username, isAdmin,
    login, refresh, logout,
  }
})
