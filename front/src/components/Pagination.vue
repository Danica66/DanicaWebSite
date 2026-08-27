<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  pageSize: number
  currentPage: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// 页码窗口：1 … current-1 current current+1 … last（最多 7 项）
const pages = computed<(number | '…')[]>(() => {
  const last = pageCount.value
  const current = props.currentPage
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  const candidates = [1, last, current - 1, current, current + 1]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of candidates) {
    if (prev && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
})

const go = (page: number) => {
  if (page < 1 || page > pageCount.value || page === props.currentPage) return
  emit('change', page)
}
</script>

<template>
  <nav class="flex flex-wrap items-center justify-center gap-1.5" aria-label="分页">
    <button
      type="button"
      :disabled="currentPage <= 1"
      class="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/60 bg-white/50 px-3 text-sm backdrop-blur-md transition-all disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10"
      @click="go(currentPage - 1)"
    >
      上一页
    </button>

    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === '…'" class="px-1 text-slate-400">…</span>
      <button
        v-else
        type="button"
        class="h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm backdrop-blur-md transition-all"
        :class="p === currentPage
          ? 'flex border-primary bg-primary font-medium text-white shadow-md shadow-primary/30'
          : 'flex border-white/60 bg-white/50 text-slate-600 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-slate-300'"
        @click="go(p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      type="button"
      :disabled="currentPage >= pageCount"
      class="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/60 bg-white/50 px-3 text-sm backdrop-blur-md transition-all disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10"
      @click="go(currentPage + 1)"
    >
      下一页
    </button>
  </nav>
</template>
