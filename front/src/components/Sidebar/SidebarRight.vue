<script setup lang="ts">
import TagCloud from './TagCloud.vue'
import MusicPlayer from './MusicPlayer.vue'
</script>

<template>
  <!-- 右侧边栏：标签云 / 音乐播放器（数据对接见 README 待开发清单） -->
  <aside class="flex flex-col gap-6">
    <TagCloud />
    <MusicPlayer />
  </aside>
</template>
