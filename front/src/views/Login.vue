<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useauthStore } from '@/stores/auth'

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
  <div class="box">
    <h2>登录</h2>

    <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />

    <div class="row">
      <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleLogin" />
    </div>

    <div class="row">
      <el-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        show-password
        @keyup.enter="handleLogin"
      />
    </div>

    <el-button type="primary" :loading="loading" class="btn" @click="handleLogin">
      {{ loading ? '登录中...' : '登录' }}
    </el-button>

    <p class="link">
      没有账号？<router-link to="/register">去注册</router-link>
    </p>
  </div>
</template>

<style scoped>
.box {
  width: 400px;
  margin: 100px auto;
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-align: center;
}

.row {
  margin: 16px 0;
}

.btn {
  width: 100%;
  margin-top: 8px;
}

.link {
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-muted);
}
</style>
