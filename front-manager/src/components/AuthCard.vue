<script setup lang="ts">
defineProps<{
  title: string
  submitText: string
  loading?: boolean
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="auth-card">
    <h2 class="auth-title">{{ title }}</h2>

    <div v-if="$slots.alert" class="auth-alert">
      <slot name="alert" />
    </div>

    <div class="auth-fields">
      <slot />
    </div>

    <el-button
      type="primary"
      class="auth-btn"
      :loading="loading"
      @click="$emit('submit')"
    >{{ loading ? '处理中...' : submitText }}</el-button>

    <div v-if="$slots.footer" class="auth-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 100px auto;
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-align: center;
}
.auth-title { margin-bottom: 16px; margin-top: 0; }

.auth-alert { margin-bottom: 16px; }

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 8px;
}

.auth-btn { width: 100%; margin-top: 8px; }

.auth-footer {
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-muted);
}
.auth-footer a { color: var(--primary); }

@media (max-width: 768px) {
  .auth-card {
    margin: 40px auto;
    padding: 24px 16px;
  }
}
</style>
