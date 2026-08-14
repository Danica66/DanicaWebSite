<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi } from '@/api/handleapi'
import { ElMessage } from 'element-plus'
import { stripMarkdown } from '@/utils/markdown'
import type { ArticleEditForm } from '@/types'
import ArticleEdit from '@/components/ArticleEdit.vue'

const router = useRouter()

const loading = ref(false)

const form = ref<ArticleEditForm>({
  id: 0,
  title: '',
  content: '',
  summary: '',
  status: 'draft',
})

const handleSubmit = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) return
  loading.value = true
  try {
    await articleApi.create({
      title: form.value.title,
      content: form.value.content,
      summary: form.value.summary || stripMarkdown(form.value.content, 150),
      status: form.value.status,
    })
    router.push('/articles')
  } catch {
    ElMessage.error('发布失败，请稍后重试')
  }
  loading.value = false
}
</script>

<template>
  <div class="editor-page">
    <div class="editor-card">
      <ArticleEdit v-model="form" :saving="loading" @save="handleSubmit" @cancel="router.back()" />
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  width: 900px;
  margin: 0 auto;
  padding: 32px var(--page-padding-x) 64px;
}

.editor-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .editor-page {
    width: 100%;
    padding-top: 20px;
  }
  .editor-card {
    padding: 16px;
  }
}
</style>
