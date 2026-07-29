<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

const articles = ref<any[]>([])
const loading = ref(true)
const activeTab = ref<'all' | 'published' | 'draft'>('all')

const fetchArticles = async () => {
  loading.value = true
  try {
    const params: any = { page: 1, limit: 999 }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res: any = await articleApi.getMine(params)
    articles.value = res.data || []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

const goDetail = (id: number) => router.push(`/articles/${id}`)
const goEdit = (id: number) => router.push(`/articles/${id}/edit`)

const handleDelete = async (id: number, title: string) => {
  try {
    await ElMessageBox.confirm(`确定删除「${title}」？此操作不可恢复。`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    await articleApi.delete(id)
    articles.value = articles.value.filter((a) => a.id !== id)
  } catch {
    ElMessageBox.alert('删除失败，请稍后重试', '错误')
  }
}

const statusLabel = (s: string) => (s === 'published' ? '已发布' : '草稿')

watch(activeTab, () => fetchArticles())

onMounted(() => fetchArticles())
</script>

<template>
  <div class="mine-page">
    <h2 class="page-title">我的文章</h2>

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
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="state-tip">加载中...</div>

    <!-- 空 -->
    <div v-else-if="articles.length === 0" class="state-tip">
      <p>暂无文章</p>
      <el-button type="primary" @click="router.push('/articles/create')">写一篇</el-button>
    </div>

    <!-- 列表 -->
    <div v-else class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="card-body" @click="goDetail(article.id)">
          <h3 class="card-title">{{ article.title }}</h3>
          <p v-if="article.summary" class="card-summary">{{ article.summary }}</p>
          <div class="card-meta">
            <span :class="['status-badge', article.status]">
              {{ statusLabel(article.status) }}
            </span>
            <span>{{ article.created_at?.slice(0, 10) }}</span>
            <span>{{ article.view_count || 0 }} 阅读</span>
          </div>
        </div>
        <div class="card-actions">
          <el-button size="small" text @click.stop="goEdit(article.id)">编辑</el-button>
          <el-button size="small" text type="danger" @click.stop="handleDelete(article.id, article.title)">
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mine-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20px;
}

/* 标签栏 */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.tab-btn {
  padding: 6px 20px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.tab-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

/* 状态提示 */
.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.article-card {
  display: flex;
  align-items: stretch;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.article-card:hover {
  border-color: var(--primary);
}

.card-body {
  flex: 1;
  padding: 16px 20px;
  cursor: pointer;
  min-width: 0;
}
.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-summary {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: var(--text-muted);
}

.status-badge {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-badge.published {
  background: #e6f7f0;
  color: #2e7d5b;
}
.status-badge.draft {
  background: #fff3e0;
  color: #e6a23c;
}

/* 操作按钮 */
.card-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}
</style>
