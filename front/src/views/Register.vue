<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useauthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useauthStore()

const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
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
  <div class="box">
    <h2>注册</h2>

    <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon />
    <el-alert v-if="successMsg" :title="successMsg" type="success" show-icon />

    <div class="row">
      <el-input v-model="username" placeholder="请输入用户名" @keyup.enter="handleRegister" />
    </div>

    <div class="row">
      <el-input
        v-model="password"
        type="password"
        placeholder="请输入密码（至少6位）"
        show-password
        @keyup.enter="handleRegister"
      />
    </div>

    <div class="row">
      <el-input
        v-model="password2"
        type="password"
        placeholder="请再次输入密码"
        show-password
        @keyup.enter="handleRegister"
      />
    </div>

    <el-button type="primary" :loading="loading" class="btn" @click="handleRegister">
      {{ loading ? '注册中...' : '注册' }}
    </el-button>

    <p class="link">
      已有账号？<router-link to="/login">去登录</router-link>
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
