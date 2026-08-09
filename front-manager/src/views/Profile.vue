<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { userApi } from '@/api/handleapi'
import { useauthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import StateTip from '@/components/StateTip.vue'
//init
const authStore = useauthStore()
//var
const loading = ref(true)
const saving = ref(false)
//创建信息格式
const form = ref({
  email: '',
  avatar: '',
})
//去掉api前缀,否则图片无法加载
const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || ''
const avatarUrl = computed(() => {
  return form.value.avatar ? apiBase + form.value.avatar : ''
})
//保存
const handleSave = async () => {
  saving.value = true
  try {
    await userApi.updateProfile({
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
//加载信息
const fetchProfile=async () => {
  loading.value = true
  try {
    const res= await userApi.getProfile()
    const p = res.data
    form.value.email = p.email || ''
    form.value.avatar = p.avatar || ''
  } catch {
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}
onMounted(async() => {
    await fetchProfile()
})

</script>

<template>
  <!-- 主体 -->
  <div class="profile-page">
    <!-- title -->
    <h2 class="page-title">个人资料</h2>
    <!-- tip组件 -->
    <StateTip v-if="loading" type="loading" />
    <!-- 用户信息 -->
    <template v-else>
      <!-- 卡片 -->
      <div class="card">
        <div class="field">
          <label>用户名</label>
          <el-input :model-value="authStore.username" disabled />
          <span class="hint">用户名不可修改</span>
        </div>

        <div class="field">
          <label>邮箱</label>
          <el-input v-model="form.email" placeholder="your@email.com" maxlength="100" clearable />
        </div>

        <div class="field">
          <label>头像</label>
          <el-input v-model="form.avatar" placeholder="https://..." maxlength="200" clearable />
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" />
        </div>
        <!-- 提交 -->
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
}
</style>
