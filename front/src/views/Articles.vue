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

const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(() => fetchArticles())
</script>

<template>
  <div class="articles-page">
    <h2 class="page-title">全部文章</h2>

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
    <div v-if="loading" class="state-tip">加载中...</div>

    <!-- 空 -->
    <div v-else-if="articles.length === 0" class="state-tip">
      <p>暂无文章</p>
    </div>

    <!-- 列表 -->
    <div v-else class="article-list">
      <article
        v-for="item in articles"
        :key="item.id"
        class="card"
        @click="goDetail(item.id)"
      >
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">
            {{ item.summary || item.content?.replace(/<[^>]*>/g, '').slice(0, 120) || '暂无摘要' }}
          </p>
          <div class="card-meta">
            <span>{{ item.created_at?.slice(0, 10) }}</span>
            <span>{{ item.view_count || 0 }} 次阅读</span>
          </div>
        </div>
        <div class="card-arrow">→</div>
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
.articles-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20px;
}

/* 搜索 */
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.search-input {
  flex: 1;
}

/* 状态 */
.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

/* 卡片列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
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
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}
.card-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 10px;
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
  font-size: 18px;
  color: var(--text-muted);
  padding-left: 16px;
  transition: color 0.2s;
}
.card:hover .card-arrow {
  color: var(--primary);
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
