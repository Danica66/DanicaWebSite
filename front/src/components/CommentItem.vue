<script setup lang="ts">
import { computed } from 'vue'
import { timeAgo } from '@/utils/time'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  comment: any
  depth: number
  currentUserId: number | null
  parentUsername?: string
}>()

const emit = defineEmits<{
  reply: [comment: any]
  remove: [id: number]
}>()

// 抖音模式：仅一级回复缩进，更深层同级对齐（缩进放在卡片上，不叠加）
const replyIndent = computed(() => props.depth >= 1)

const isOwn = computed(() =>
  props.currentUserId && props.comment.user_id === props.currentUserId
)
</script>

<template>
  <div class="comment-item">
    <div class="comment-card" :style="replyIndent ? { marginLeft: '40px' } : {}">
      <div class="comment-head">
        <span class="comment-user">{{ comment.username }}</span>
        <span v-if="parentUsername && depth >= 2" class="reply-to">回复 @{{ parentUsername }}</span>
        <span class="comment-time">{{ timeAgo(comment.created_at) }}</span>
      </div>
      <div class="comment-content markdown-body" v-html="renderMarkdown(comment.content)"></div>
      <div class="comment-actions">
        <button v-if="currentUserId" class="action-btn" @click="$emit('reply', comment)">回复</button>
        <button v-if="isOwn" class="action-btn danger" @click="$emit('remove', comment.id)">删除</button>
      </div>
    </div>

    <!-- 递归 -->
    <CommentItem
      v-for="child in comment.children"
      :key="child.id"
      :comment="child"
      :depth="depth + 1"
      :current-user-id="currentUserId"
      :parent-username="comment.username"
      @reply="$emit('reply', $event)"
      @remove="$emit('remove', $event)"
    />
  </div>
</template>

<style scoped>
.comment-card {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: border-color 0.2s;
}
.comment-card:hover {
  border-color: var(--primary);
}
.comment-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.comment-user {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}
.reply-to {
  font-size: 12px;
  color: var(--text-muted);
}
.comment-time {
  font-size: 12px;
  color: var(--text-muted);
}
.comment-content {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
  word-break: break-word;
  margin-bottom: 8px;
}
.comment-actions {
  display: flex;
  gap: 12px;
}
.action-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
}
.action-btn:hover {
  color: var(--primary);
}
.action-btn.danger:hover {
  color: #e74c3c;
}
</style>
