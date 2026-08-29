<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import type { ArticleListItem } from '@shared/types'
import ArticleCard from '@/components/ArticleCard.vue'
import StateTip from '@/components/StateTip.vue'
import SearchInput from '@/components/SearchInput.vue'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

const articles = ref<ArticleListItem[]>([])
const keyword = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const limit = 10

const fetchArticles = async () => {
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

// 搜索：回到第一页重新加载
const handleSearch = () => {
  page.value = 1
  fetchArticles()
}

// 翻页：滚动到顶部
const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(fetchArticles)
</script>

<template>
  <!-- 单栏居中布局：无侧边栏，聚焦文章列表 -->
  <div class="mx-auto max-w-[900px] px-6 py-10">
    <!-- 标题 + 搜索框（同一行左右分布） -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">文章列表</h2>
      <SearchInput v-model="keyword" @search="handleSearch" />
    </div>

    <StateTip v-if="loading" type="loading" />
    <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章" />

    <!-- 文章卡片列表 -->
    <div v-else class="flex flex-col gap-4">
      <ArticleCard
        v-for="item in articles"
        :key="item.id"
        :article="item"
        clickable
        show-arrow
        :highlight="keyword"
        @click="goDetail"
      />
    </div>

    <!-- 分页器：底部居中 -->
    <div v-if="total > limit" class="mt-10">
      <Pagination
        :total="total"
        :page-size="limit"
        :current-page="page"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
