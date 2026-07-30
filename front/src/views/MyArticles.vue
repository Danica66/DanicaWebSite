<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'
import { ElMessageBox } from 'element-plus'
import StateTip from '@/components/StateTip.vue'
import ArticleCard from '@/components/ArticleCard.vue'
//init
const router = useRouter()
//var
const articles = ref<any[]>([])
const loading = ref(true)
const activeTab = ref<'all' | 'published' | 'draft'>('all')
//获取文章
const fetchArticles = async () => {
  //同Home.vue
  loading.value = true
  try {
    const params: any = { page: 1, limit: 999 }
    if (activeTab.value !== 'all') params.status = activeTab.value
    const res: any = await articleApi.getMine(params)
    articles.value = res.data || []
  } catch {
    articles.value = []
  } finally { loading.value = false }
}
//跳转
const goDetail = (id: number) => router.push(`/articles/${id}`)
const goEdit = (id: number) => router.push(`/articles/${id}/edit`)
//删除处理
const handleDelete = async (id: number, title: string) => {
  try {
    await ElMessageBox.confirm(`确定删除「${title}」？此操作不可恢复。`, '删除确认', {
      confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning',
    })
  } catch { 
    return 
  }
  try {
    await articleApi.delete(id)
    articles.value = articles.value.filter(a => a.id !== id)
  } catch {
    ElMessageBox.alert('删除失败，请稍后重试', '错误')
  }
}
//标签切换查询
watch(activeTab, () => 
    fetchArticles()
)

onMounted(() => 
    fetchArticles()
)
</script>

<template>
  <!-- 主体 -->
  <div class="mine-page">
    <!-- title -->
    <h2 class="page-title">我的文章</h2>
    <!-- 三个标签 -->
    <div class="tabs">
      <button
        v-for="tab in [
          { value: 'all' as const, label: '全部' },
          { value: 'published' as const, label: '已发布' },
          { value: 'draft' as const, label: '草稿' },
        ]"
        :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >{{ tab.label }}</button>
    </div>
    <!-- tip组件 -->
    <StateTip v-if="loading" type="loading" />
    <!-- 无文章则写一篇 -->
    <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章">
      <!-- 插槽 -->
      <template #extra>
        <el-button type="primary" @click="router.push('/articles/create')">写一篇</el-button>
      </template>
    </StateTip>
    <!-- 展示文章 -->
    <div v-else class="article-list">
      <!-- 文章卡片组件 -->
      <ArticleCard
        v-for="item in articles"
        :key="item.id"
        :article="item"
        show-status
        @click="goDetail"
      >
        <!-- 插槽 -->
        <template #actions>
          <el-button size="small" text @click.stop="goEdit(item.id)">编辑</el-button>
          <el-button size="small" text type="danger" @click.stop="handleDelete(item.id, item.title)">删除</el-button>
        </template>
      </ArticleCard>
    </div>
  </div>
</template>

<style scoped>
.mine-page {
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

.article-list { display: flex; flex-direction: column; gap: 12px; }
</style>
