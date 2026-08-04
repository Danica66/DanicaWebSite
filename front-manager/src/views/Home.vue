<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'
import StateTip from '@/components/StateTip.vue'
import ArticleCard from '@/components/ArticleCard.vue'
//init
const router = useRouter()
//var
const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'
const articles = ref<any[]>([])
const loading = ref(false)
//获取最近文章
const fetchRecent = async () => {
  //1.开始加载状态
  //2.调用接口获取数据
  //3.若2抛出异常则获取空数据
  //4.关闭加载状态
  loading.value = true
  try {
    const res = await articleApi.getList({ page: 1, limit: 5, keyword: '' })
    articles.value = res.data.list || []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

const goDetail = (id: number) => router.push(`/articles/${id}`)

onMounted(() => 
    fetchRecent()
)
</script>

<template>
  <!-- 主体 -->
  <div class="home">
    <!-- 标题栏 -->
    <section class="banner">
      <h1>欢迎来到 {{ siteName }}</h1>
      <p>记录思考，分享知识。每一篇文章都是一次对话。</p>
    </section>
    <!-- 最近文章 -->
    <section class="recent">
      <div class="recent-header">
        <h2>最新文章</h2>
        <router-link to="/articles" class="view-all">查看全部 →</router-link>
      </div>
      <!-- tip组件 -->
      <StateTip v-if="loading" type="loading" />
      <StateTip v-else-if="articles.length === 0" type="empty" message="暂无文章" />
      <!-- 展示文章 -->
      <div v-else class="article-list">
        <ArticleCard
          v-for="item in articles"
          :key="item.id"
          :article="item"
          @click="goDetail"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.banner {
  text-align: center;
  padding: 64px 24px 48px;
  background: linear-gradient(135deg, #409eff 0%, #6fb3f8 100%);
  color: #fff;
  margin-bottom: 40px;
}
.banner h1 { 
  font-size: 32px; 
  margin-bottom: 12px; 
  font-weight: 700; 
}
.banner p { 
  font-size: 16px; 
  opacity: 0.9; 
}

.recent {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 var(--page-padding-x) 64px;
}
.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}
.recent-header h2 { 
  font-size: 20px; 
  font-weight: 600; 
  color: var(--text); 
}
.view-all { 
  font-size: 14px; 
  color: var(--primary); 
  text-decoration: none; 
}
.view-all:hover { 
  text-decoration: underline; 
}

.article-list { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

@media (max-width: 768px) {
  .banner { 
    padding: 40px 16px 32px; 
  }
  .banner h1 { 
    font-size: 24px; 
  }
  .banner p { 
    font-size: 14px; 
  }
}
</style>
