<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StateTip from '@/components/StateTip.vue'
import { useRoute, useRouter } from 'vue-router'
import { articleApi, uploadApi } from '@/api/handleapi'
import { ElMessage } from 'element-plus'
import { renderMarkdown, stripMarkdown } from '@/utils/markdown'

const route = useRoute()
const router = useRouter()

const articleId = ref<number | null>(null)
const title = ref('')
const content = ref('')
const summary = ref('')
const loading = ref(false)
const pageLoading = ref(false)
const showPreview = ref(false)
const uploadLoading = ref(false)

const isEdit = computed(() => !!articleId.value)

const previewHtml = computed(() => renderMarkdown(content.value))

const fetchArticleDetail = async () => {
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

const insertMarkdown = (before: string, after = '') => {
  const textarea = document.querySelector('.md-textarea') as HTMLTextAreaElement
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = content.value.slice(start, end)
  content.value = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
  // 恢复焦点和选区
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.selectionStart = start + before.length
    textarea.selectionEnd = start + before.length + selected.length
  })
}

const toolbarActions: { label: string; before: string; after: string; tip: string }[] = [
  { label: 'B', before: '**', after: '**', tip: '加粗' },
  { label: 'I', before: '*', after: '*', tip: '斜体' },
  { label: 'H2', before: '\n## ', after: '', tip: '二级标题' },
  { label: 'H3', before: '\n### ', after: '', tip: '三级标题' },
  { label: '`', before: '`', after: '`', tip: '行内代码' },
  { label: '```', before: '\n```\n', after: '\n```\n', tip: '代码块' },
  { label: '>', before: '\n> ', after: '', tip: '引用' },
  { label: '·', before: '\n- ', after: '', tip: '无序列表' },
  { label: '1.', before: '\n1. ', after: '', tip: '有序列表' },
  { label: '🔗', before: '[', after: '](url)', tip: '链接' },
  { label: '🖼', before: '![alt](', after: ')', tip: '图片（外链）' },
  { label: '—', before: '\n---\n', after: '', tip: '分隔线' },
]

// 图片上传：选择文件 -> 上传 -> 拿到 URL 插入 markdown
const fileInput = ref<HTMLInputElement | null>(null)
const triggerUpload = () => fileInput.value?.click()

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // 允许连续选择同一文件
  if (!file) return
  uploadLoading.value = true
  try {
    const res: any = await uploadApi.uploadImage(file)
    const url = res.data?.url
    if (!url) throw new Error('上传响应缺少 url')
    insertMarkdown(`![图片](${url})`)
    ElMessage.success('图片上传成功')
  } catch (err: any) {
    const msg = err?.response?.data?.message || '图片上传失败'
    ElMessage.error(msg)
  } finally {
    uploadLoading.value = false
  }
}

const handleSubmit = async (status: 'published' | 'draft') => {
  if (!title.value.trim() || !content.value.trim()) return
  loading.value = true
  try {
    const data = {
      title: title.value,
      content: content.value,
      summary: summary.value || stripMarkdown(content.value, 150),
      status,
    }
    if (isEdit.value) {
      await articleApi.update(articleId.value!, data)
    } else {
      await articleApi.create(data)
    }
    const dest = isEdit.value ? `/articles/${articleId.value}` : '/articles'
    router.push(dest)
  } catch {
    ElMessage.error(isEdit.value ? '保存失败，请稍后重试' : '发布失败，请稍后重试')
  }
  loading.value = false
}

onMounted(fetchArticleDetail)
</script>

<template>
  <div class="editor-page">
    <StateTip v-if="pageLoading" type="loading" />

    <template v-else>
      <h2 class="page-title">{{ isEdit ? '编辑文章' : '写文章' }}</h2>

      <div class="field">
        <el-input v-model="title" placeholder="文章标题" size="large" maxlength="100" show-word-limit />
      </div>

      <div class="field">
        <el-input v-model="summary" placeholder="摘要（选填，留空则自动截取正文前 150 字）" maxlength="200" show-word-limit />
      </div>

      <!-- Markdown 工具栏 -->
      <div class="md-toolbar">
        <button
          v-for="a in toolbarActions"
          :key="a.label"
          :title="a.tip"
          class="md-btn"
          @click="insertMarkdown(a.before, a.after)"
        >{{ a.label }}</button>
        <span class="toolbar-spacer" />
        <button class="md-btn" :disabled="uploadLoading" title="上传本地图片" @click="triggerUpload">
          {{ uploadLoading ? '上传中…' : '⏫ 图片' }}
        </button>
        <button class="md-btn preview-toggle" @click="showPreview = !showPreview">
          {{ showPreview ? '✏ 编辑' : '👁 预览' }}
        </button>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        @change="handleFileChange"
      />

      <!-- 编辑区 -->
      <div class="md-editor" :class="{ previewing: showPreview }">
        <textarea
          v-show="!showPreview"
          v-model="content"
          class="md-textarea"
          placeholder="支持 Markdown 语法..."
          spellcheck="false"
        />
        <div
          v-if="showPreview"
          class="md-preview markdown-body"
          v-html="previewHtml"
        />
      </div>

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
  max-width: 900px;
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

/* 工具栏 */
.md-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
.md-btn {
  min-width: 32px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.md-btn:hover { background: var(--primary-light); border-color: var(--primary); }
.md-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.toolbar-spacer { flex: 1; }
.preview-toggle { font-size: 12px; font-weight: 400; }

/* 编辑区 */
.md-editor {
  border: 1px solid var(--border);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}
.md-textarea {
  width: 100%;
  min-height: 420px;
  padding: 16px;
  border: none;
  outline: none;
  resize: vertical;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
  background: var(--bg-card);
  tab-size: 2;
}
.md-textarea::placeholder { color: var(--text-muted); }

/* 预览区 */
.md-preview {
  min-height: 420px;
  padding: 16px 20px;
  background: var(--bg-card);
  overflow-y: auto;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
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
  .md-textarea, .md-preview {
    min-height: 320px;
  }
}
</style>
