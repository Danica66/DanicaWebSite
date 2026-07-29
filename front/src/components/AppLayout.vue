<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useauthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useauthStore()

// 黑夜模式
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="nav-inner">
        <router-link to="/" class="logo">Danica</router-link>
        <div class="nav-links">
          <router-link to="/articles">文章</router-link>
          <router-link v-if="authStore.isLogin" to="/mine">我的文章</router-link>
          <router-link v-if="authStore.isLogin" to="/articles/create">写文章</router-link>

          <span class="theme-btn" @click="toggleDark">
            {{ isDark ? '☀️' : '🌙' }}
          </span>

          <template v-if="authStore.isLogin">
            <router-link to="/profile" class="user-tag">{{ authStore.username }}</router-link>
            <span class="logout-btn" @click="handleLogout">退出</span>
          </template>
          <template v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register-link">注册</router-link>
          </template>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>Danica · 个人博客</p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 4px var(--shadow);
}
.nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  user-select: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
}
.nav-links a {
  color: var(--text);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: var(--primary);
}
.theme-btn {
  font-size: 18px;
  cursor: pointer;
  user-select: none;
}
.user-tag {
  color: var(--text-muted);
  cursor: default;
  font-size: 14px;
}
.logout-btn {
  color: #e6a23c;
  cursor: pointer;
}
.logout-btn:hover {
  color: #f0a020;
}
.register-link {
  padding: 4px 12px;
  border: 1px solid var(--primary);
  border-radius: 4px;
  color: var(--primary);
}
.register-link:hover {
  background: var(--primary);
  color: #fff !important;
}

.main-content {
  flex: 1;
}

.footer {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-size: 13px;
  border-top: 1px solid var(--border);
  margin-top: 40px;
}
</style>
