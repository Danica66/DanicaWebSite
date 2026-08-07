<script setup lang="ts">
import { highlightText } from '@/utils/highlight'
import { stripMarkdown } from '@/utils/markdown'

defineProps<{
  article: any
  clickable?: boolean
  showArrow?: boolean
  showStatus?: boolean
  highlight?: string
}>()

defineEmits<{
  click: [id: number]
}>()

const statusLabel = (s: string) => (s === 'published' ? '已发布' : '草稿')
const summaryText = (content: string) => {
  return content ? stripMarkdown(content, 120) : ''
}
</script>

<template>
  <article
    :class="['card', { clickable }]"
    @click="$emit('click', article.id)"
  >
    <div class="card-body">
      <h3 class="card-title" v-html="highlightText(article.title, highlight)"></h3>
      <p v-if="article.summary || article.content" class="card-summary" v-html="highlightText(article.summary || summaryText(article.content), highlight)"></p>
      <div class="card-meta">
        <span v-if="showStatus" :class="['status-badge', article.status]">
          {{ statusLabel(article.status) }}
        </span>
        <span>{{ article.created_at?.slice(0, 10) }}</span>
        <span>{{ article.view_count || 0 }} 次阅读</span>
      </div>
    </div>

    <span v-if="showArrow" class="card-arrow">→</span>

    <div v-if="$slots.actions" class="card-actions" @click.stop>
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.card.clickable {
  cursor: pointer;
}
.card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--card-shadow);
  border-color: var(--primary);
}

.card-body {
  flex: 1;
  min-width: 0;
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
.card-title :deep(mark),
.card-summary :deep(mark) {
  background: var(--highlight-bg);
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
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

.card-arrow {
  font-size: 18px;
  color: var(--text-muted);
  padding-left: 16px;
  transition: color 0.2s;
  flex-shrink: 0;
}
.card:hover .card-arrow {
  color: var(--primary);
}

.card-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .card {
    padding: 16px 18px;
  }
}
</style>
