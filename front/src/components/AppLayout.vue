<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const themeStore = useThemeStore()
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col bg-gradient-to-br from-sky-100 via-slate-100 to-rose-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
    <!-- 背景装饰光斑：毛玻璃卡片模糊时能看到它们 -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-600/20" />
      <div class="absolute top-1/3 -right-40 h-[26rem] w-[26rem] rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-600/20" />
      <div class="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-600/20" />
    </div>

    <AppHeader />

    <main class="relative z-10 flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
