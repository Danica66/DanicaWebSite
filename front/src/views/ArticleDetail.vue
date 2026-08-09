<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { articleApi } from '@/api/article'
import Giscus from '@giscus/vue'
import StateTip from '@/components/StateTip.vue'
import { useThemeStore } from '@/stores/theme'
import lightThemeCss from '@/giscus/light.css?raw'
import darkThemeCss from '@/giscus/dark.css?raw'
//init
const route = useRoute()
const router = useRouter()
const { isDark } = storeToRefs(useThemeStore())
//var
const article = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')
const rendered = computed(() => renderMarkdown(article.value?.content || ''))
const articleId = ref(0)

//giscus 主题跟随网站主题：把 CSS 转成 data URL 内联。
//不能直接引 /giscus/light.css —— giscus iframe 在 https://giscus.app 内部加载该 URL，
//站点是 http 时会被浏览器 mixed-content 拦截；data URL 不发起网络请求，无此问题。
//注意：btoa 只支持 Latin-1，CSS 含中文等非 ASCII 字符会抛异常，必须先按 UTF-8 编码。
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

//获取文章
const fetchArticle = async () => {
  const id = Number(route.params.id)
  if (!id) { 
    errorMsg.value = '文章 ID 无效'; 
    loading.value = false; 
    return 
  }
  articleId.value = id
  loading.value = true
  try {
    const res= await articleApi.getDetail(id)
    article.value = res.data
  } catch {
    errorMsg.value = '文章加载失败'
  } finally { loading.value = false }
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

onMounted(()=>{
  fetchArticle()
})
</script>

<template>
  <!-- 主体 -->
  <div class="detail">
    <!-- tip组件 -->
    <StateTip v-if="loading" type="loading" />
    <!-- 报错返回 -->
    <div v-else-if="errorMsg" class="state-tip">
      <p class="error-text">{{ errorMsg }}</p>
      <el-button class="back-btn" type="primary" plain @click="goBack">返回</el-button>
    </div>
    <!-- 文章展示 -->
    <template v-else-if="article">
      <!-- 文章标签 -->
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span>{{ article.created_at?.slice(0, 10) }}</span>
            <span>{{ article.view_count || 0 }} 次阅读</span>
          </div>
        </header>

        <div class="article-body markdown-body" v-html="rendered" />

        <div class="article-footer">
          <div class="footer-actions">
            <el-button type="primary" plain @click="goBack">← 返回</el-button>
          </div>
        </div>
      </article>

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
    </template>
    <!-- tip组件 -->
    <StateTip v-else type="empty" message="文章不存在">
      <!-- 插槽 -->
      <template #extra>
        <el-button type="primary" plain @click="goBack">返回</el-button>
      </template>
    </StateTip>
  </div>
</template>

<style scoped>
.detail {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px var(--page-padding-x) 120px;
}

.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
.error-text { color: #e6a23c; }
.back-btn { margin-top: 16px; }

.article-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.article-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
  margin-bottom: 12px;
}
.article-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--text-muted);
}
.article-body {
  font-size: 16px;
  line-height: 2;
  color: var(--text);
  word-break: break-word;
  margin-bottom: 40px;
}
/* ===== 代码块增强（:deep 才能命中 JS 注入的 DOM） ===== */
.article-body :deep(pre) {
  position: relative;
  padding-top: 44px;          /* 顶部留出工具栏的空间 */
}
.article-body :deep(.code-toolbar) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #262637;        /* 比代码背景略亮的一层 */
  border-bottom: 1px solid #33334a;
  border-radius: 8px 8px 0 0;
}
.article-body :deep(.code-lang) {
  font-size: 12px;
  color: #8a93a8;
  text-transform: lowercase;
}
.article-body :deep(.code-copy) {
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #4a4a66;
  border-radius: 4px;
  background: transparent;
  color: #b8c0d0;
  cursor: pointer;
  opacity: 0;                 /* 默认隐藏，悬停代码块时显示 */
  transition: opacity 0.2s;
}
.article-body :deep(pre:hover .code-copy) {
  opacity: 1;
}
.article-body :deep(.code-copy:hover) {
  background: #3a3a55;
  color: #fff;
}
.article-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .article-title { font-size: 22px; }
  .article-body { font-size: 15px; line-height: 1.8; }
}
</style>
