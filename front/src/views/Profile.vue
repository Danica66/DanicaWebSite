<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { userApi } from '@/api/handleapi'
import { uploadApi } from '@/api/handleapi'
import { getErrMsg } from '@/utils/error'
import { useauthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import StateTip from '@/components/StateTip.vue'
import SendCodeField from '@/components/SendCodeField.vue'

const authStore = useauthStore()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const originalEmail = ref('')

const form = reactive({
  email: '',
  avatar: '',
})

const veriCode = ref('')

const emailChanged = computed(() => form.email !== originalEmail.value)

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || ''
const avatarUrl = computed(() => form.avatar ? apiBase + form.avatar : '')

const handleSave = async () => {
  saving.value = true
  try {
    const payload: { email?: string; avatar?: string; code?: string } = { avatar: form.avatar }
    if (emailChanged.value) {
      if (!veriCode.value) { ElMessage.warning('修改邮箱需要输入验证码'); saving.value = false; return }
      payload.email = form.email
      payload.code = veriCode.value
    }
    await userApi.updateProfile(payload)
    ElMessage.success('保存成功')
    originalEmail.value = form.email
    veriCode.value = ''
  } catch (err: any) {
    ElMessage.error(getErrMsg(err, '保存失败'))
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
    const res= await uploadApi.uploadAvatar(file)
    form.avatar = res.data.url
    await userApi.updateProfile({ avatar: form.avatar })
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const triggerUpload = () => fileInput.value?.click()

const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await userApi.getProfile()
    const p = res.data
    originalEmail.value = p.email || ''
    form.email = p.email || ''
    form.avatar = p.avatar || ''
  } catch {
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">个人资料</h2>
    <StateTip v-if="loading" type="loading" />
    <template v-else>
      <div class="card">
        <div class="field">
          <label>用户名</label>
          <el-input :model-value="authStore.username" disabled />
          <span class="hint">用户名不可修改</span>
        </div>

        <div class="field">
          <label>邮箱</label>
          <SendCodeField
            v-model:email="form.email"
            v-model:code="veriCode"
            :send-code-fn="userApi.sendCode"
          />
          <span v-if="!emailChanged" class="hint">修改邮箱需要验证码</span>
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
  padding: 32px var(--page-padding-x) 64px;
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

@media (max-width: 768px) {
  .card {
    padding: 20px 18px;
  }
  .avatar-row {
    flex-wrap: wrap;
  }
}
</style>
