<script setup lang="ts">
// ===== 标签云 =====
// 数据来自 /api/articles/tags（按标签聚合，仅已发布）；点击标签跳转到列表页过滤
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import type { TagCount } from '@shared/types'

const router = useRouter()
const tags = ref<TagCount[]>([])

onMounted(async () => {
  try {
    const res = await articleApi.getTags()
    tags.value = res.data || []
  } catch {
    tags.value = []
  }
})

const goTag = (tag: string) => router.push({ path: '/articles', query: { tag } })
</script>

<template>
  <section v-if="tags.length" class="glass-card p-5">
    <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      <span class="text-primary">#</span> 标签云
    </h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="t in tags"
        :key="t.tag"
        class="cursor-pointer rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
        @click="goTag(t.tag)"
      >
        {{ t.tag }}
      </span>
    </div>
  </section>
</template>
