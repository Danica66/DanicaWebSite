<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useauthStore } from '@/stores/auth'
import { articleApi } from '@/api/handleapi'
import DOMPurify from 'dompurify'

const route = useRoute()
const router = useRouter()
const authStore = useauthStore()

const article = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')
const isAuthor = ref(false)
const safeHtml = (html: string) => DOMPurify.sanitize(html)

const fetchArticle = async () => {
  const id = Number(route.params.id)
  if (!id) {
    errorMsg.value = '文章 ID 无效'
    loading.value = false
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res: any = await articleApi.getDetail(id)
    article.value = res.data
    isAuthor.value = String(authStore.userId) === String(article.value.author_id)
  } catch {
    errorMsg.value = '文章加载失败'
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
const goEdit = () => {
  router.push(`/articles/${article.value.id}/edit`)
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="detail">
    <!-- 加载中 -->
    <div v-if="loading" class="state-tip">
      <p>加载中...</p>
    </div>

    <!-- 错误 -->
    <div v-else-if="errorMsg" class="state-tip">
      <p class="error-text">{{ errorMsg }}</p>
      <el-button class="back-btn" type="primary" plain @click="goBack">返回</el-button>
    </div>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span>{{ article.created_at?.slice(0, 10) }}</span>
            <span>{{ article.view_count || 0 }} 次阅读</span>
          </div>
        </header>

        <div class="article-body" v-html="safeHtml(article.content)" />

        <div class="article-footer">
          <div class="footer-actions">
            <el-button type="primary" plain @click="goBack">← 返回</el-button>
            <el-button v-if="isAuthor" type="warning" plain @click="goEdit">编辑</el-button>
          </div>
        </div>
      </article>
    </template>

    <!-- 文章不存在 -->
    <div v-else class="state-tip">
      <p>文章不存在</p>
      <el-button class="back-btn" type="primary" plain @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<style scoped>
.detail {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* 状态提示 */
.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
.error-text {
  color: #e6a23c;
}
.back-btn {
  margin-top: 16px;
}

/* 文章 */
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
</style>
