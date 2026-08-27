<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'

const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }

// 暗色模式（与 ArticleDetail 的 giscus 共享同一份状态）
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/60 bg-white/60 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/60">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
      <!-- Logo -->
      <router-link to="/" class="select-none text-xl font-bold tracking-wide text-primary">
        {{ siteName }}
      </router-link>

      <!-- 桌面端导航 -->
      <nav class="hidden items-center gap-6 text-[15px] md:flex">
        <router-link
          to="/articles"
          class="rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-white/50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/10"
        >
          文章
        </router-link>
        <button
          type="button"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
          class="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white/50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/10"
          @click="toggleTheme"
        >
          <!-- 月亮 / 太阳图标 -->
          <svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </nav>

      <!-- 移动端汉堡按钮 -->
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/50 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <!-- 移动端下拉菜单 -->
    <nav v-if="menuOpen" class="border-t border-white/60 px-6 py-4 dark:border-white/10 md:hidden">
      <div class="flex flex-col gap-4">
        <router-link
          to="/articles"
          class="text-[15px] text-slate-600 dark:text-slate-300"
          @click="closeMenu"
        >
          文章
        </router-link>
        <button
          type="button"
          class="flex items-center gap-2 text-left text-[15px] text-slate-600 dark:text-slate-300"
          @click="toggleTheme"
        >
          <span>{{ isDark ? '☀️' : '🌙' }}</span>
          {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
        </button>
      </div>
    </nav>
  </header>
</template>
