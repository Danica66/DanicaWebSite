<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
//init
const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'

// 移动端菜单
const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }

// 黑夜模式（共享状态，AppLayout 与 ArticleDetail 的 giscus 同步）
// 注意：isDark 必须用 storeToRefs 解构，直接解构会得到解包后的快照（失去响应式）
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme, initTheme } = themeStore

onMounted(() => {
  initTheme()
})

</script>

<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="nav-inner">
        <router-link to="/" class="logo">{{ siteName }}</router-link>
        <button class="hamburger" @click="menuOpen = !menuOpen">
          {{ menuOpen ? '✕' : '☰' }}
        </button>
        <div class="nav-links" :class="{ open: menuOpen }">
          <router-link to="/articles" @click="closeMenu">文章</router-link>
          <span class="theme-btn" @click="toggleTheme">
            {{ isDark ? '☀️' : '🌙' }}
          </span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>{{ siteName }} · 个人博客</p>
      <a href="https://beian.miit.gov.cn/" target="_blank">黑ICP备2026009394号</a>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=23100002000275" target="_blank" > &nbsp;黑公网安备23100002000275号</a>
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
.theme-btn {
  font-size: 18px;
  cursor: pointer;
  user-select: none;
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
