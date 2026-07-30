<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useauthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
//init
const router = useRouter()
const authStore = useauthStore()
//var
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  //1.检查账号密码合法性,不合法写入errorMsg
  //2.开始加载状态
  //3.调用store.register传参,写入successMsg,等待1.5秒跳转登陆界面
  //4.若3抛出异常则写入errorMsg
  //5.关闭加载状态
  errorMsg.value = ''
  successMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '用户名和密码不能为空'
    return
  }
  if (password.value !== password2.value) {
    errorMsg.value = '两次密码不一致'
    return
  }
  if (password.value.length < 5) {
    errorMsg.value = '密码至少 5 位'
    return
  }
  loading.value = true
  try {
    await authStore.register(username.value, password.value)
    successMsg.value = '注册成功，请登录'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 登录组件 -->
  <AuthCard title="注册" submit-text="注册" :loading="loading" @submit="handleRegister">
    <!-- alert插槽 -->
    <template #alert>
      <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
      <el-alert v-if="successMsg" :title="successMsg" type="success" show-icon />
    </template>

    <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleRegister" />
    <el-input v-model="password" type="password" placeholder="请输入密码（至少5位）" show-password
      @keyup.enter="handleRegister" />
    <el-input v-model="password2" type="password" placeholder="请再次输入密码" show-password
      @keyup.enter="handleRegister" />
    <!-- 页脚插槽 -->
    <template #footer>
      已有账号？<router-link to="/login">去登录</router-link>
    </template>
  </AuthCard>
</template>
