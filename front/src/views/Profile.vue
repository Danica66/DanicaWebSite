<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { userApi } from '@/api/handleapi'
import { uploadApi } from '@/api/handleapi'
import { useauthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const authStore = useauthStore()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  nickname: '',
  email: '',
  avatar: '',
})

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || ''
const avatarUrl = computed(() => {
  return form.value.avatar ? apiBase + form.value.avatar : ''
})

onMounted(async () => {
  loading.value = true
  try {
    const res: any = await userApi.getProfile()
    const p = res.data
    form.value.nickname = p.nickname || ''
    form.value.email = p.email || ''
    form.value.avatar = p.avatar || ''
  } catch {
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  saving.value = true
  try {
    await userApi.updateProfile({
      nickname: form.value.nickname,
      email: form.value.email,
      avatar: form.value.avatar,
    })
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const res: any = await uploadApi.uploadAvatar(file)
    form.value.avatar = res.data.url
    await userApi.updateProfile({ avatar: form.value.avatar })
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">个人资料</h2>

    <div v-if="loading" class="state-tip">加载中...</div>

    <template v-else>
      <div class="card">
        <div class="field">
          <label>用户名</label>
          <el-input :model-value="authStore.username" disabled />
          <span class="hint">用户名不可修改</span>
        </div>

        <div class="field">
          <label>昵称</label>
          <el-input v-model="form.nickname" placeholder="设置昵称" maxlength="30" clearable />
        </div>

        <div class="field">
          <label>邮箱</label>
          <el-input v-model="form.email" placeholder="your@email.com" maxlength="100" clearable />
        </div>

        <div class="field">
          <label>头像</label>
          <div class="avatar-row">
            <el-input v-model="form.avatar" placeholder="https://..." maxlength="200" clearable />
            <el-button :loading="uploading" @click="triggerUpload">上传</el-button>
          </div>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="handleUpload" />
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" />
        </div>

        <div class="actions">
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 24px;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px 32px;
}

.field {
  margin-bottom: 20px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 6px;
}
.hint {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.actions {
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

.avatar-row {
  display: flex;
  gap: 8px;
}
.avatar-row .el-input {
  flex: 1;
}
.avatar-preview {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 8px;
  border: 2px solid var(--border);
}
</style>
