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
  <div class="site-bg relative flex min-h-screen flex-col">
    <AppHeader />

    <main class="relative z-10 flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
/* 主体区域：40×40 网格线背景，固定不随滚动（亮 / 暗两套配色） */
.site-bg {
  background-color: #f8fafc;
  background-image:
    linear-gradient(rgba(139, 148, 158, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 148, 158, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
  background-attachment: fixed;
}

html.dark .site-bg {
  background-color: #0d1117;
  background-image:
    linear-gradient(rgba(139, 148, 158, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 148, 158, 0.06) 1px, transparent 1px);
}
</style>
