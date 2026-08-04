<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useauthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useauthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '用户名和密码不能为空'
    return
  }
  loading.value = true
  try {
    const isAdmin = await authStore.login(username.value, password.value)
    if (!isAdmin) {
      authStore.logout()
      errorMsg.value = '您不是管理员，无权访问控制台'
      return
    }
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="控制台登录" submit-text="登录" :loading="loading" @submit="handleLogin">
    <template #alert>
      <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
    </template>

    <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleLogin" />
    <el-input v-model="password" type="password" placeholder="请输入密码" show-password
      @keyup.enter="handleLogin" />
  </AuthCard>
</template>
