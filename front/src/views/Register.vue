<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useauthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useauthStore()

const email = ref('')
const code = ref('')
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
const errorMsg = ref('')
const successMsg = ref('')
const codeSent = ref(false)

// 用户改了邮箱 → 重置发码状态，旧验证码作废
watch(email, () => {
  if (codeSent.value) {
    codeSent.value = false
    code.value = ''
    successMsg.value = ''
    countdown.value = 0
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
  }
})

const countdownText = computed(() => {
  if (sending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s 后重发`
  return '发送验证码'
})

const handleSendCode = async () => {
  errorMsg.value = ''
  if (!email.value) {
    errorMsg.value = '请输入邮箱'
    return
  }
  sending.value = true
  try {
    await authStore.sendCode(email.value)
    codeSent.value = true
    successMsg.value = '验证码已发送，请查收邮件'
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) { clearInterval(countdownTimer!); countdownTimer = null }
    }, 1000)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '发送验证码失败'
  } finally {
    sending.value = false
  }
}

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''
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
    errorMsg.value = err.response?.data?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="注册" submit-text="注册" :loading="loading" @submit="handleRegister">
    <template #alert>
      <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
      <el-alert v-if="successMsg" :title="successMsg" type="success" show-icon />
    </template>

    <div class="email-row">
      <el-input v-model="email" placeholder="请输入邮箱" @keyup.enter="handleSendCode" />
      <el-button
        type="primary"
        :disabled="!email || countdown > 0"
        :loading="sending"
        class="send-btn"
        @click="handleSendCode"
      >{{ countdownText }}</el-button>
    </div>

    <el-input v-model="code" placeholder="请输入6位验证码" maxlength="6" />
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

<style scoped>
.email-row {
  display: flex;
  gap: 8px;
}
.email-row .el-input { flex: 1; }
.send-btn {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
