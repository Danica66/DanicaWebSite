<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { articleApi } from '@/api/article'
import type { ArticleDetail } from '@shared/types'
import Giscus from '@giscus/vue'
import StateTip from '@/components/StateTip.vue'
import { useThemeStore } from '@/stores/theme'
import lightThemeCss from '@/giscus/light.css?raw'
import darkThemeCss from '@/giscus/dark.css?raw'

const route = useRoute()
const router = useRouter()
const { isDark } = storeToRefs(useThemeStore())

const article = ref<ArticleDetail | null>(null)
const loading = ref(true)
const errorMsg = ref('')

const rendered = computed(() => renderMarkdown(article.value?.content || ''))

// giscus 主题跟随网站主题：把 CSS 转成 data URL 内联。
// 不能直接引 /giscus/light.css —— giscus iframe 在 https://giscus.app 内部加载该 URL，
// 站点是 http 时会被浏览器 mixed-content 拦截；data URL 不发起网络请求，无此问题。
// 注意：btoa 只支持 Latin-1，CSS 含中文等非 ASCII 字符会抛异常，必须先按 UTF-8 编码。
const toBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

const giscusTheme = computed(() => {
  const css = isDark.value ? darkThemeCss : lightThemeCss
  return `data:text/css;base64,${toBase64(css)}`
})

// 获取文章
const fetchArticle = async () => {
  const id = Number(route.params.id)
  if (!id) {
    errorMsg.value = '文章 ID 无效'
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await articleApi.getDetail(id)
    article.value = res.data
  } catch {
    errorMsg.value = '文章加载失败'
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()

// ===== 代码块增强：注入语言标签 + 复制按钮 =====
// v-html 渲染的是纯 HTML 字符串，无法在字符串里绑事件，
// 所以渲染完成后用 DOM 注入工具栏。
// 复制优先用 navigator.clipboard（https/localhost 可用）；
// 纯 http 站点不可用，降级到 execCommand('copy') 兼容。
const copyText = (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  // 降级方案：临时 textarea + execCommand（http 站点可用，已被标记废弃但无替代）
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy') ? resolve() : reject(new Error('copy failed'))
    } catch (e) {
      reject(e)
    } finally {
      document.body.removeChild(ta)
    }
  })
}

const enhanceCodeBlocks = () => {
  document.querySelectorAll('.article-body pre').forEach((pre) => {
    if (pre.querySelector('.code-toolbar')) return // 已注入过，跳过
    const code = pre.querySelector('code')
    // 从 <code class="hljs language-ts"> 提取语言名
    const langMatch = code?.className.match(/language-(\w+)/)
    const lang = langMatch ? langMatch[1] || '' : ''

    // 创建工具栏：语言 + 复制按钮
    const toolbar = document.createElement('div')
    toolbar.className = 'code-toolbar'
    const langSpan = document.createElement('span')
    langSpan.className = 'code-lang'
    langSpan.textContent = lang
    const copyBtn = document.createElement('button')
    copyBtn.className = 'code-copy'
    copyBtn.textContent = '复制'
    toolbar.append(langSpan, copyBtn)
    pre.appendChild(toolbar)

    // 点击复制
    copyBtn.addEventListener('click', async () => {
      try {
        await copyText(code?.textContent || '')
        copyBtn.textContent = '已复制'
        setTimeout(() => (copyBtn.textContent = '复制'), 1500)
      } catch {
        copyBtn.textContent = '复制失败'
        setTimeout(() => (copyBtn.textContent = '复制'), 1500)
      }
    })
  })
}

// 文章内容变化（v-html 更新）后，DOM 才真正生成，nextTick 里注入
watch(rendered, () => {
  nextTick(enhanceCodeBlocks)
})

onMounted(fetchArticle)
</script>

<template>
  <!-- 单栏宽版布局：沉浸式阅读 -->
  <div class="mx-auto max-w-4xl px-6 py-10">
    <!-- 返回导航 -->
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
      @click="goBack"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      返回列表
    </button>

    <StateTip v-if="loading" type="loading" />

    <!-- 加载失败 -->
    <div v-else-if="errorMsg" class="glass-card p-12 text-center">
      <p class="text-amber-500">{{ errorMsg }}</p>
      <button
        type="button"
        class="mt-5 rounded-full bg-primary px-6 py-2 text-sm text-white shadow-md shadow-primary/30 transition-all hover:bg-primary-dark"
        @click="goBack"
      >
        返回
      </button>
    </div>

    <template v-else-if="article">
      <!-- 文章主体 -->
      <article class="glass-card p-6 sm:p-10">
        <header class="mb-8 border-b border-white/60 pb-6 dark:border-white/10">
          <h1 class="text-3xl font-bold leading-snug text-slate-900 dark:text-slate-50 sm:text-4xl">
            {{ article.title }}
          </h1>
          <div class="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-400 dark:text-slate-500">
            <span
              v-if="article.tag"
              class="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary"
            >
              #{{ article.tag }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {{ article.created_at?.slice(0, 10) }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {{ article.view_count || 0 }} 次阅读
            </span>
          </div>
        </header>

        <!-- Markdown 正文 -->
        <div class="article-body markdown-body" v-html="rendered" />
      </article>

      <!-- Giscus 评论区 -->
      <div class="glass-card mt-8 p-5 sm:p-6">
        <Giscus
          repo="Danica66/DanicaWebSite"
          repoId="R_kgDOTh5CTQ"
          category="Announcements"
          categoryId="DIC_kwDOTh5CTc4DC6p-"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="giscusTheme"
          lang="zh-CN"
          loading="lazy"
          crossorigin="anonymous"
          async
        />
      </div>
    </template>

    <!-- 文章不存在 -->
    <StateTip v-else type="empty" message="文章不存在">
      <template #extra>
        <button
          type="button"
          class="rounded-full border border-white/60 bg-white/50 px-5 py-2 text-sm text-slate-600 backdrop-blur-md transition-all hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-slate-300"
          @click="goBack"
        >
          返回
        </button>
      </template>
    </StateTip>
  </div>
</template>

<style scoped>
/* ===== 代码块增强（:deep 才能命中 JS 注入的 DOM） =====
   这里用普通 CSS 而不是 @apply，避免编辑器 CSS 语言服务对 @apply/@reference 的误报。 */
.article-body :deep(pre) {
  position: relative; /* 工具栏 absolute 定位的锚点 */
  padding-top: 3rem;  /* 顶部留出工具栏的空间 */
}

.article-body :deep(.code-toolbar) {
  position: absolute;
  inset-inline: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  background: #262637; /* 比代码背景略亮的一层 */
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 0.75rem 0.75rem 0 0;
}

.article-body :deep(.code-lang) {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: lowercase;
}

.article-body :deep(.code-copy) {
  cursor: pointer;
  padding: 0.125rem 0.625rem;
  border: 1px solid rgb(100 116 139 / 0.5);
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.75rem;
  color: #cbd5e1;
  opacity: 0; /* 默认隐藏，悬停代码块时显示 */
  transition: all 0.15s;
}

.article-body :deep(.code-copy:hover) {
  background: rgb(71 85 105 / 0.5);
  color: #fff;
}

.article-body :deep(pre:hover .code-copy) {
  opacity: 1;
}
</style>
