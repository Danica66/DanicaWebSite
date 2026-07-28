<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'

const router = useRouter()

const articles = ref<any[]>([])
const keyword = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const limit = 10

const fetchArticles = async () => {
  loading.value = true
  try {
    const res: any = await articleApi.getList({ page: page.value, limit, keyword: keyword.value })
    articles.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchArticles()
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <div class="home">
    <!-- Banner -->
    <section class="banner">
      <h1>欢迎来到 Danica</h1>
      <p>记录思考，分享知识。每一篇文章都是一次对话。</p>
    </section>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索文章..."
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="state-tip">
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="articles.length === 0" class="state-tip">
      <p class="empty-text">暂无文章</p>
    </div>

    <!-- 文章列表 -->
    <div v-else class="article-list">
      <article
        v-for="item in articles"
        :key="item.id"
        class="card"
        @click="goDetail(item.id)"
      >
        <div class="card-body">
          <h2 class="card-title">{{ item.title }}</h2>
          <p class="card-summary">
            {{ item.summary || item.content?.replace(/<[^>]*>/g, '').slice(0, 120) || '暂无摘要' }}
          </p>
          <div class="card-meta">
            <span class="meta-date">{{ item.created_at?.slice(0, 10) }}</span>
            <span class="meta-views">{{ item.view_count || 0 }} 次阅读</span>
          </div>
        </div>
        <div class="card-arrow">
          <span>→</span>
        </div>
      </article>
    </div>

    <!-- 分页 -->
    <div v-if="total > limit" class="pager">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        v-model:current-page="page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* Banner */
.banner {
  text-align: center;
  padding: 64px 24px 48px;
  background: linear-gradient(135deg, #409eff 0%, #6fb3f8 100%);
  color: #fff;
  margin-bottom: 32px;
}
.banner h1 {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 700;
}
.banner p {
  font-size: 16px;
  opacity: 0.9;
}

/* 搜索 */
.search-bar {
  max-width: 640px;
  margin: 0 auto 32px;
  display: flex;
  gap: 12px;
  padding: 0 24px;
}
.search-input {
  flex: 1;
}

/* 状态提示 */
.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
.empty-text {
  font-size: 16px;
}

/* 文章卡片 */
.article-list {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
}
.card {
  display: flex;
  align-items: center;
  padding: 24px;
  margin-bottom: 16px;
  background: var(--bg-card);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--card-shadow);
  border-color: var(--primary);
}
.card-body {
  flex: 1;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.4;
}
.card-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
}
.card-arrow {
  font-size: 20px;
  color: var(--text-muted);
  padding-left: 16px;
  transition: color 0.2s;
}
.card:hover .card-arrow {
  color: #409eff;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 24px;
}
</style>
