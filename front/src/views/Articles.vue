<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import type { ArticleListItem } from '@shared/types'
import ArticleCard from '@/components/ArticleCard.vue'
import StateTip from '@/components/StateTip.vue'
import SearchInput from '@/components/SearchInput.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()

const articles = ref<ArticleListItem[]>([])
const keyword = ref('')
const activeTag = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const limit = 10

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await articleApi.getList({ page: page.value, limit, keyword: keyword.value, tag: activeTag.value })
    articles.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

// 标签过滤来自 URL（标签云点击跳转过来）
const syncTag = () => {
  activeTag.value = typeof route.query.tag === 'string' ? route.query.tag : ''
}
const clearTag = () => router.push('/articles')

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

onMounted(() => {
  syncTag()
  fetchArticles()
})

// 点击标签云跳转过来（URL 的 tag 变化）→ 回到第一页重新加载
watch(() => route.query.tag, () => {
  syncTag()
  page.value = 1
  fetchArticles()
})
</script>

<template>
  <!-- 单栏居中布局：无侧边栏，聚焦文章列表 -->
  <div class="mx-auto max-w-[900px] px-6 py-10">
    <!-- 标题 + 搜索框（同一行左右分布） -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">文章列表</h2>
        <span v-if="activeTag" class="glass-chip gap-1.5">
          #{{ activeTag }}
          <button type="button" class="text-slate-400 transition-colors hover:text-primary" title="清除标签过滤" @click="clearTag">×</button>
        </span>
      </div>
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
