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
    class="group glass-card flex items-center p-5 sm:p-6"
    :class="clickable ? 'glass-card-hover cursor-pointer' : ''"
    @click="clickable && $emit('click', article.id)"
  >
    <div class="min-w-0 flex-1">
      <!-- 标题（含搜索高亮） -->
      <h3
        class="mb-2 text-lg font-semibold leading-snug text-slate-800 dark:text-slate-100"
        v-html="highlightText(article.title, highlight)"
      />
      <!-- 摘要（含搜索高亮） -->
      <p
        v-if="article.summary || article.content"
        class="mb-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
        v-html="highlightText(article.summary || summaryText(article.content), highlight)"
      />
      <!-- 元信息：状态 / 日期 / 阅读量 -->
      <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
        <span v-if="showStatus" :class="['glass-chip', article.status === 'published' ? '!text-emerald-600 dark:!text-emerald-400' : '!text-amber-600 dark:!text-amber-400']">
          {{ statusLabel(article.status) }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {{ article.created_at?.slice(0, 10) }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {{ article.view_count || 0 }} 次阅读
        </span>
      </div>
    </div>

    <!-- 右侧箭头 -->
    <span
      v-if="showArrow"
      class="ml-4 shrink-0 text-lg text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary dark:text-slate-600"
    >
      →
    </span>

    <!-- 操作区插槽（右侧竖排按钮） -->
    <div
      v-if="$slots.actions"
      class="ml-4 flex shrink-0 flex-col justify-center gap-1.5 border-l border-white/60 pl-4 dark:border-white/10"
      @click.stop
    >
      <slot name="actions" />
    </div>
  </article>
</template>
