<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  search: []
}>()
</script>

<template>
  <div class="flex w-full gap-2 sm:max-w-sm">
    <input
      v-model="model"
      type="search"
      placeholder="搜索文章..."
      class="h-10 flex-1 rounded-full border border-white/60 bg-white/60 px-4 text-sm text-slate-700 backdrop-blur-md outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:placeholder:text-slate-500"
      @keyup.enter="emit('search')"
    />
    <button
      type="button"
      class="h-10 shrink-0 rounded-full bg-primary px-5 text-sm font-medium text-white shadow-md shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40 active:scale-95"
      @click="emit('search')"
    >
      搜索
    </button>
  </div>
</template>
