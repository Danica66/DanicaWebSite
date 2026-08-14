<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useauthStore } from '@/stores/auth'
//init
const router = useRouter()
const authStore = useauthStore()

const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'

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
        <router-link to="/" class="logo">{{ siteName }}</router-link>
        <div class="nav-right">
          <span class="theme-btn" @click="toggleDark">
            {{ isDark ? '☀️' : '🌙' }}
          </span>
          <span class="logout-btn" @click="handleLogout">退出登录</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>{{ siteName }} · 个人博客</p>
      <a href="https://beian.miit.gov.cn/" target="_blank">黑ICP备2026009394号</a>
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

/* 汉堡按钮（默认隐藏，移动端显示） */
.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text);
  cursor: pointer;
  padding: 0;
  line-height: 1;
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
.rss-nav {
  color: #e6a23c !important;
  font-weight: 500;
}
.theme-btn {
  font-size: 18px;
  cursor: pointer;
  user-select: none;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* ===== 移动端 ===== */
@media (max-width: 768px) {
  .nav-inner {
    padding: 0 16px;
  }

  /* 显示汉堡按钮 */
  .hamburger {
    display: block;
  }

  /* 导航链接收起，展开时变成竖向菜单 */
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: var(--navbar-bg);
    padding: 16px;
    gap: 14px;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 4px 12px var(--shadow);
  }
  .nav-links.open {
    display: flex;
  }
}
</style>
