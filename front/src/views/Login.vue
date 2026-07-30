<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useauthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
//init
const router = useRouter()
const route = useRoute()
const authStore = useauthStore()
//var
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  //1.检测账号密码合法性,不合法return并写入errorMsg
  //2.开始加载状态
  //3.调用store.login传参,检测上次访问路径并跳转或跳转主页
  //4.3若抛出异常则写入errorMsg
  //5.关闭加载状态
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '用户名和密码不能为空'
    return
  }
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
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
  <!-- 登录组件 -->
  <AuthCard title="登录" submit-text="登录" :loading="loading" @submit="handleLogin">
    <!-- alert插槽 -->
    <template #alert>
      <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
    </template>

    <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleLogin" />
    <el-input v-model="password" type="password" placeholder="请输入密码" show-password
      @keyup.enter="handleLogin" />
    <!-- 页脚插槽 -->
    <template #footer>
      没有账号？<router-link to="/register">去注册</router-link>
    </template>
  </AuthCard>
</template>
