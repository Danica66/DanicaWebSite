<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getErrMsg } from '@/utils/error'
import { useauthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import SendCodeField from '@/components/SendCodeField.vue'

const router = useRouter()
const route = useRoute()
const authStore = useauthStore()

const email = ref('')
const code = ref('')
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  errorMsg.value = ''
  if (!email.value || !code.value) {
    errorMsg.value = '邮箱和验证码不能为空'
    return
  }
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
    await authStore.register(username.value, password.value, email.value, code.value)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: any) {
    errorMsg.value = getErrMsg(err, '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="注册" submit-text="注册" :loading="loading" @submit="handleRegister">
    <template #alert>
      <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
    </template>

    <SendCodeField
      v-model:email="email"
      v-model:code="code"
      :send-code-fn="authStore.sendCode"
    />

    <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleRegister" />
    <el-input v-model="password" type="password" placeholder="请输入密码（至少5位）" show-password
      @keyup.enter="handleRegister" />
    <el-input v-model="password2" type="password" placeholder="请再次输入密码" show-password
      @keyup.enter="handleRegister" />

    <template #footer>
      已有账号？<router-link to="/login">去登录</router-link>
    </template>
  </AuthCard>
</template>
