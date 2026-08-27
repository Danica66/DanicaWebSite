<script setup lang="ts">
// ===== 标签云 =====
// 后端暂未提供标签接口（见 README 待开发清单），先用静态数据演示效果
// TODO: 对接文章标签接口后改为动态加载
const tags = [
  { name: 'Vue', size: 'text-sm' },
  { name: 'TypeScript', size: 'text-base' },
  { name: 'Node.js', size: 'text-sm' },
  { name: 'Express', size: 'text-xs' },
  { name: 'CSS', size: 'text-sm' },
  { name: 'Docker', size: 'text-xs' },
  { name: 'Vite', size: 'text-base' },
  { name: 'MySQL', size: 'text-xs' },
]
</script>

<template>
  <section class="glass-card p-5">
    <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      <span class="text-primary">#</span> 标签云
    </h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="cursor-pointer rounded-full bg-primary/10 px-3 py-1 font-medium text-primary transition-all hover:bg-primary hover:text-white"
        :class="tag.size"
      >
        {{ tag.name }}
      </span>
    </div>
  </section>
</template>
