<script setup lang="ts">
defineProps<{
  type?: 'loading' | 'empty' | 'error'
  message?: string
}>()
</script>

<template>
  <div class="state-tip">
    <p v-if="type === 'loading'">加载中...</p>
    <p v-else-if="type === 'error'" class="error-text">{{ message || '出错了' }}</p>
    <p v-else-if="type === 'empty'">{{ message || '暂无数据' }}</p>
    <slot />
    <!-- 自定义额外内容，如按钮 -->
    <div v-if="$slots.extra" class="state-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.state-tip {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
.error-text { color: #e6a23c; }
.state-extra { margin-top: 16px; }
</style>
