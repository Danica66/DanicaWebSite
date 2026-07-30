<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StateTip from '@/components/StateTip.vue'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { articleApi } from '@/api/handleapi'
import { ElMessage } from 'element-plus'
//init
const route = useRoute()
const router = useRouter()
//var
const articleId = ref<number | null>(null)
const title = ref('')
const content = ref('')
const summary = ref('')
const loading = ref(false)
const pageLoading = ref(false)
//编辑状态(发布文章时文章无id,更新文章有id)
const isEdit = computed(() => !!articleId.value)
//富文本编辑器
const editorOptions = {
  placeholder: '在这里写正文...',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  },
}
//获取文章详情
const fetcharticleDetail=async()=>{
    const id = route.params.id
    if (id) {
      articleId.value = Number(id)
      pageLoading.value = true
      try {
        const res: any = await articleApi.getDetail(articleId.value)
        const article = res.data
        title.value = article.title
        content.value = article.content
        summary.value = article.summary || ''
      } catch {
        router.push('/')
      } finally {
        pageLoading.value = false
      }
    }
}
//提交处理
const handleSubmit = async (status: 'published' | 'draft') => {
  //1.去掉空格后的标题和文章不为空
  //2.开始加载状态
  //3.获取数据.如果状态可编辑则调用更新接口后跳转对应文章,否则调用发布接口后跳转我的文章
  //4.3抛出异常则写入ELMessage
  //5.关闭加载状态
  if (!title.value.trim() || !content.value.trim()) return
  
  loading.value = true
  try {
    const data = {
      title: title.value,
      content: content.value,
      summary: summary.value || content.value.replace(/<[^>]*>/g, '').slice(0, 150),
      status,
    }
    if (isEdit.value) {
      await articleApi.update(articleId.value!, data)
    } else {
      await articleApi.create(data)
    }
    const dest = isEdit.value ? `/articles/${articleId.value}` : '/mine'
    router.push(dest)
  } catch {
    ElMessage.error(isEdit.value ? '保存失败，请稍后重试' : '发布失败，请稍后重试')
  }
  loading.value = false
}
onMounted(async () => {
    await fetcharticleDetail()
})
</script>

<template>
  <!-- 主体 -->
  <div class="editor-page">
    <!-- tip组件 -->
    <StateTip v-if="pageLoading" type="loading" />

    <template v-else>
      <!-- title -->
      <h2 class="page-title">{{ isEdit ? '编辑文章' : '写文章' }}</h2>
      <!-- 两个input -->
      <div class="field">
        <el-input v-model="title" placeholder="文章标题" size="large" maxlength="100" show-word-limit />
      </div>

      <div class="field">
        <el-input v-model="summary" placeholder="摘要（选填，留空则自动截取正文前 150 字）" maxlength="200" show-word-limit />
      </div>
      <!-- 文章内容 -->
      <div class="editor-wrapper">
        <QuillEditor
          v-model:content="content"
          :options="editorOptions"
          contentType="html"
          theme="snow"
          style="height: 420px"
        />
      </div>
      <!-- 提交 -->
      <div class="actions">
        <el-button @click="router.back()">取消</el-button>
        <el-button type="primary" plain :loading="loading" @click="handleSubmit('draft')">
          保存草稿
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit('published')">
          {{ isEdit ? '更新' : '发布' }}
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.editor-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px var(--page-padding-x) 64px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 24px;
}

.field {
  margin-bottom: 16px;
}

.editor-wrapper {
  margin-bottom: 24px;
}

.editor-wrapper :deep(.ql-toolbar.ql-snow) {
  background: var(--bg-card);
  border-color: var(--border);
}
.editor-wrapper :deep(.ql-container.ql-snow) {
  background: var(--bg-card);
  border-color: var(--border);
  color: var(--text);
}
.editor-wrapper :deep(.ql-editor.ql-blank::before) {
  color: var(--text-muted);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  .actions .el-button {
    flex: 1;
    min-width: 80px;
  }
}
</style>
