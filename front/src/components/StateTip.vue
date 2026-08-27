<script setup lang="ts">
defineProps<{
  type?: 'loading' | 'empty' | 'error'
  message?: string
}>()

const text = (type?: 'loading' | 'empty' | 'error', message?: string) => {
  if (type === 'loading') return '加载中...'
  if (type === 'error') return message || '出错了'
  return message || '暂无数据'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center text-slate-400 dark:text-slate-500">
    <!-- 加载中：旋转圆环 -->
    <div
      v-if="type === 'loading'"
      class="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent"
      role="status"
      aria-label="加载中"
    />
    <p class="mt-4 text-sm" :class="type === 'error' ? 'text-amber-500' : ''">
      {{ text(type, message) }}
    </p>
    <slot />
    <!-- 自定义额外内容，如按钮 -->
    <div v-if="$slots.extra" class="mt-4">
      <slot name="extra" />
    </div>
  </div>
</template>
