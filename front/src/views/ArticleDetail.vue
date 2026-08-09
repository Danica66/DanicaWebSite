<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { articleApi } from '@/api/article'
import Giscus from '@giscus/vue'
import StateTip from '@/components/StateTip.vue'
//init
const route = useRoute()
const router = useRouter()
//var
const article = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')
const isAuthor = ref(false)
const rendered = computed(() => renderMarkdown(article.value?.content || ''))
const articleId = ref(0)

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

onMounted(fetchArticle)
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
    theme="preferred_color_scheme"
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
