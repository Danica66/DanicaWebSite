<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import StateTip from '@/components/StateTip.vue'
import ArticleCard from '@/components/ArticleCard.vue'
//init
const router = useRouter()
//var
const articles = ref<any[]>([])
const keyword = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const limit = 10
//获取文章
const fetchArticles = async () => {
  //原理同Home.vue->fetchRecent
  loading.value = true
  try {
    const res = await articleApi.getList({ page: page.value, limit, keyword: keyword.value })
    articles.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    articles.value = []
  } finally { 
    loading.value = false 
  }
}
//搜索
const handleSearch = () => {
    page.value = 1
    fetchArticles() 
}
//切换页面
const handlePageChange = (newPage: number) => {
    page.value = newPage
    fetchArticles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
//跳转
const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(() => 
    fetchArticles()
)
</script>

<template>
  <!-- 主体 -->
  <div class="articles-page">
    <h2 class="page-title">全部文章</h2>

    <div class="search-bar">
      <el-input v-model="keyword" placeholder="搜索文章..." clearable class="search-input"
        @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <!-- 插槽 -->
    <StateTip v-if="loading" type="loading" />
    <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章" />
    <!-- 展示文章 -->
    <div v-else class="article-list">
      <ArticleCard
        v-for="item in articles"
        :key="item.id"
        :article="item"
        show-arrow
        :highlight="keyword"
        @click="goDetail"
      />
    </div>
    <!-- 分页系统 -->
    <div v-if="total > limit" class="pager">
      <el-pagination background layout="prev, pager, next"
        :total="total" :page-size="limit" v-model:current-page="page"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px var(--page-padding-x) 64px;
}
.page-title { 
  font-size: 22px; 
  font-weight: 600; 
  color: var(--text); 
  margin-bottom: 20px; 
}

.search-bar { 
  display: flex; 
  gap: 12px; 
  margin-bottom: 24px; 
}
.search-input { 
  flex: 1; 
}

.article-list { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.pager { 
  display: flex; 
  justify-content: center; 
  margin-top: 32px; 
}
</style>
