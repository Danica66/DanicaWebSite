<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'

const router = useRouter()

const articles = ref<any[]>([])
const loading = ref(false)

const fetchRecent = async () => {
  loading.value = true
  try {
    const res: any = await articleApi.getList({ page: 1, limit: 5, keyword: '' })
    articles.value = res.data.list || []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(() => fetchRecent())
</script>

<template>
  <div class="home">
    <!-- Banner -->
    <section class="banner">
      <h1>欢迎来到 Danica</h1>
      <p>记录思考，分享知识。每一篇文章都是一次对话。</p>
    </section>

    <!-- 最新文章 -->
    <section class="recent">
      <div class="recent-header">
        <h2>最新文章</h2>
        <router-link to="/articles" class="view-all">查看全部 →</router-link>
      </div>

      <div v-if="loading" class="state-tip">加载中...</div>

      <div v-else-if="articles.length === 0" class="state-tip">
        <p>暂无文章</p>
      </div>

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
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Banner */
.banner {
  text-align: center;
  padding: 64px 24px 48px;
  background: linear-gradient(135deg, #409eff 0%, #6fb3f8 100%);
  color: #fff;
  margin-bottom: 40px;
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

/* 最新文章 */
.recent {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 64px;
}
.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}
.recent-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}
.view-all {
  font-size: 14px;
  color: var(--primary);
  text-decoration: none;
}
.view-all:hover {
  text-decoration: underline;
}

/* 状态 */
.state-tip {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

/* 卡片列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
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
</style>
