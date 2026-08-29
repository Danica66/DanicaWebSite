<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import type { ArticleListItem } from '@shared/types'
import HeroSection from '@/components/HeroSection.vue'
import SidebarLeft from '@/components/Sidebar/SidebarLeft.vue'
import SidebarRight from '@/components/Sidebar/SidebarRight.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import StateTip from '@/components/StateTip.vue'

const router = useRouter()

const articles = ref<ArticleListItem[]>([])
const loading = ref(false)
const total = ref(0)
const limit = 5 // 首页只展示最近 5 篇

// 获取最近文章
const fetchRecent = async () => {
  loading.value = true
  try {
    const res = await articleApi.getList({ page: 1, limit, keyword: '' })
    articles.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(fetchRecent)
</script>

<template>
  <div>
    <!-- 全屏 Hero -->
    <HeroSection />

    <!-- 三列网格：左 240 / 中 1fr / 右 260（随断点收缩） -->
    <div
      id="recent"
      class="mx-auto max-w-6xl scroll-mt-20 px-6 pt-10 pb-16 grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_220px] xl:grid-cols-[240px_1fr_260px]"
    >
      <!-- 左侧边栏：个人信息（粘性） -->
      <div class="md:sticky md:top-20 md:self-start">
        <SidebarLeft />
      </div>

      <!-- 主内容区 -->
      <section class="min-w-0">
        <div class="mb-5 flex items-baseline justify-between">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">最新文章</h2>
          <div class="flex items-baseline gap-4">
            <span class="text-xs text-slate-400 dark:text-slate-500">共 {{ total }} 篇</span>
            <router-link to="/articles" class="text-sm text-primary transition-colors hover:underline">
              查看全部 →
            </router-link>
          </div>
        </div>

        <StateTip v-if="loading" type="loading" />
        <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章" />

        <!-- 只展示最近几篇，不设分页 -->
        <div v-else class="flex flex-col gap-4">
          <ArticleCard
            v-for="item in articles"
            :key="item.id"
            :article="item"
            clickable
            show-arrow
            @click="goDetail"
          />
        </div>
      </section>

      <!-- 右侧边栏：标签云 / 音乐播放器（仅 ≥lg 显示） -->
      <div class="hidden lg:sticky lg:top-20 lg:block lg:self-start">
        <SidebarRight />
      </div>
    </div>
  </div>
</template>
