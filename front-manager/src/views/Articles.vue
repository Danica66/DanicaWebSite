<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'
import { useauthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import StateTip from '@/components/StateTip.vue'
import ArticleCard from '@/components/ArticleCard.vue'

const router = useRouter()
const authStore = useauthStore()

type Tab = 'all' | 'mine' | 'draft'
const activeTab = ref<Tab>('all')
const articles = ref<any[]>([])
const keyword = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const limit = 10

const isOwn = (article: any) => article.author_id === authStore.userId

const fetchAll = async () => {
  loading.value = true
  try {
    const res = await articleApi.getList({ page: page.value, limit, keyword: keyword.value })
    articles.value = res.data.list || []
    total.value = res.data.total || 0
  } finally { loading.value = false }
}

const fetchMine = async (status?: string) => {
  loading.value = true
  try {
    const params: any = { page: 1, limit: 999 }
    if (status) params.status = status
    const res: any = await articleApi.getMine(params)
    articles.value = res.data || []
    total.value = 0
  } finally { loading.value = false }
}

const fetchArticles = () => {
  if (activeTab.value === 'all') fetchAll()
  else if (activeTab.value === 'draft') fetchMine('draft')
  else fetchMine()
}

const handleSearch = () => { page.value = 1; fetchArticles() }

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goDetail = (id: number) => router.push(`/articles/${id}`)
const goEdit = (id: number) => router.push(`/articles/${id}/edit`)

const handleDelete = async (id: number, title: string) => {
  try {
    await ElMessageBox.confirm(`确定删除「${title}」？`, '删除确认', {
      confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning',
    })
  } catch { return }
  try {
    await articleApi.delete(id)
    articles.value = articles.value.filter(a => a.id !== id)
  } catch {
    ElMessageBox.alert('删除失败', '错误')
  }
}

watch(activeTab, () => { page.value = 1; keyword.value = ''; fetchArticles() })
onMounted(fetchArticles)
</script>

<template>
  <div class="articles-page">
    <h2 class="page-title">文章管理</h2>

    <!-- tabs -->
    <div class="tabs">
      <button v-for="tab in [
        { value: 'all' as const, label: '全部文章' },
        { value: 'mine' as const, label: '我的文章' },
        { value: 'draft' as const, label: '草稿' },
      ]" :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value">{{ tab.label }}</button>
    </div>

    <!-- 搜索（仅全部文章） -->
    <div v-if="activeTab === 'all'" class="search-bar">
      <el-input v-model="keyword" placeholder="搜索文章..." clearable class="search-input"
        @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <StateTip v-if="loading" type="loading" />
    <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章">
      <template v-if="activeTab !== 'all'" #extra>
        <el-button type="primary" @click="router.push('/articles/create')">写一篇</el-button>
      </template>
    </StateTip>

    <div v-else class="article-list">
      <ArticleCard
        v-for="item in articles"
        :key="item.id"
        :article="item"
        :show-status="activeTab !== 'all'"
        :highlight="activeTab === 'all' ? keyword : ''"
        @click="goDetail"
      >
        <template v-if="isOwn(item)" #actions>
          <el-button size="small" text @click.stop="goEdit(item.id)">编辑</el-button>
          <el-button size="small" text type="danger" @click.stop="handleDelete(item.id, item.title)">删除</el-button>
        </template>
      </ArticleCard>
    </div>

    <!-- 分页（仅全部文章） -->
    <div v-if="activeTab === 'all' && total > limit" class="pager">
      <el-pagination background layout="prev, pager, next"
        :total="total" :page-size="limit" v-model:current-page="page"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px var(--page-padding-x) 64px;
}
.page-title { font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 20px; }

.tabs { display: flex; gap: 8px; margin-bottom: 24px; }
.tab-btn {
  padding: 6px 20px; border: 1px solid var(--border); border-radius: 6px;
  background: var(--bg-card); color: var(--text); font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.tab-btn:hover { border-color: var(--primary); color: var(--primary); }
.tab-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }

.search-bar { display: flex; gap: 12px; margin-bottom: 24px; }
.search-input { flex: 1; }

.article-list { display: flex; flex-direction: column; gap: 12px; }

.pager { display: flex; justify-content: center; margin-top: 32px; }
</style>
