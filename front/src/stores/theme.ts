import { defineStore } from 'pinia'
import { ref } from 'vue'

// 主题状态（组合式 API / setup store 写法）：
// AppLayout（切换按钮）与 ArticleDetail（giscus）共用同一份响应式状态。
// 主题只由网站内的切换按钮决定，不跟随系统偏好，默认亮色。
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // 只读取网站自己持久化的主题，没有记录则默认亮色
  function readStoredTheme(): boolean {
    return localStorage.getItem('theme') === 'dark'
  }

  // 挂载时初始化一次（幂等）
  function initTheme() {
    isDark.value = readStoredTheme()
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 切换并持久化
  function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, initTheme, toggleTheme }
})
