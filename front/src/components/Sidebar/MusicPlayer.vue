<script setup lang="ts">
// ===== 音乐播放器（占位） =====
// TODO: 对接网易云/自定义歌单（见 README 待开发清单）
</script>

<template>
  <section class="glass-card p-5">
    <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      <svg class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
      音乐播放器
    </h3>
    <div class="flex flex-col items-center gap-3 py-6 text-slate-400 dark:text-slate-500">
      <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
      <p class="text-xs">占位待扩展</p>
    </div>
  </section>
</template>
