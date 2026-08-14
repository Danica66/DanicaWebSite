<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadApi } from '@/api/handleapi'
import { ElMessage } from 'element-plus'
import type { ArticleEditForm } from '@/types'

const props = defineProps<{
  modelValue: ArticleEditForm
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ArticleEditForm): void
  (e: 'save'): void
  (e: 'cancel'): void
}>()

// 与父级对象共享引用：编辑内容直接写入父级数据
const form = computed({
  get: () => props.modelValue,
  set: (v: ArticleEditForm) => emit('update:modelValue', v),
})

const contentTextarea = ref<HTMLTextAreaElement | null>(null)
const uploadLoading = ref(false)

// 在光标处插入文本（粘贴图片插入 markdown 用）
const insertMarkdown = (before: string, after = '') => {
  const textarea = contentTextarea.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.value.content.slice(start, end)
  form.value.content =
    form.value.content.slice(0, start) + before + selected + after + form.value.content.slice(end)
  // 恢复焦点和选区
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.selectionStart = start + before.length
    textarea.selectionEnd = start + before.length + selected.length
  })
}

// 粘贴图片自动上传
const handlePaste = async (e: ClipboardEvent) => {
  const files = Array.from(e.clipboardData?.files || [])
  const image = files.find(f => f.type.startsWith('image/'))
  if (!image) return // 没有图片 → 正常粘贴文本
  e.preventDefault()
  uploadLoading.value = true
  try {
    const res: any = await uploadApi.uploadImage(image)
    const url = res.data?.url
    if (!url) throw new Error('上传响应缺少 url')
    insertMarkdown(`![图片](${url})`)
    ElMessage.success('图片已上传并插入')
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

// 保存：校验后通知父组件（父组件负责 create/update）
const handleSave = () => {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  emit('save')
}
</script>

<template>
  <div class="article-edit">
    <el-form label-width="70px">
      <el-form-item label="标题" required>
        <el-input v-model="form.title" placeholder="文章标题" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="文章摘要（可选）" />
      </el-form-item>
      <el-form-item label="内容" required>
        <textarea
          ref="contentTextarea"
          v-model="form.content"
          class="md-textarea"
          rows="12"
          :placeholder="uploadLoading ? '图片上传中…' : '支持 Markdown 语法，可直接粘贴图片（自动上传）'"
          spellcheck="false"
          @paste="handlePaste"
        ></textarea>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio value="draft">草稿</el-radio>
          <el-radio value="published">发布</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="article-edit-actions">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<style scoped>
.article-edit :deep(.el-form-item__label) {
  color: var(--text-secondary);
}
.md-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
  background: var(--bg-card);
  resize: vertical;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.md-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}
.md-textarea::placeholder {
  color: var(--text-muted);
}
.article-edit :deep(.el-input__wrapper),
.article-edit :deep(.el-textarea__inner) {
  background-color: var(--bg-card);
}
.article-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
</style>
