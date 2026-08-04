<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { commentApi } from '@/api/handleapi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { buildTree } from '@/utils/tree'
import StateTip from '@/components/StateTip.vue'
import CommentItem from '@/components/CommentItem.vue'

const props = defineProps<{
  articleId: number
  currentUserId: number | null
  isLogin: boolean
}>()

const comments = ref<any[]>([])
const loading = ref(false)
const newComment = ref('')
const replyTarget = ref<any>(null)
const submitLoading = ref(false)

// 平铺 → 树
const commentTree = computed(() => buildTree(comments.value))

const fetchComments = async () => {
  loading.value = true
  try {
    const res: any = await commentApi.getList(props.articleId)
    comments.value = res.data || []
  } catch {
    comments.value = []
  } finally {
    loading.value = false
  }
}

const handleReply = (comment: any) => {
  replyTarget.value = comment
  newComment.value = ''
}

const cancelReply = () => {
  replyTarget.value = null
  newComment.value = ''
}

const handleSubmit = async () => {
  if (!newComment.value.trim()) return
  submitLoading.value = true
  try {
    await commentApi.create(props.articleId, {
      content: newComment.value.trim(),
      parent_id: replyTarget.value?.id || null,
    })
    ElMessage.success('评论成功')
    newComment.value = ''
    replyTarget.value = null
    fetchComments()
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '评论失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定删除这条评论吗？', '提示', {
      confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning',
    })
  } catch { return }
  try {
    await commentApi.delete(commentId)
    ElMessage.success('已删除')
    fetchComments()
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '删除失败')
  }
}

// articleId 变化时重新加载
watch(() => props.articleId, fetchComments, { immediate: true })
</script>

<template>
  <section class="comment-section">
    <h3 class="comment-title">评论（{{ comments.length }}）</h3>

    <StateTip v-if="loading" type="loading" message="加载评论中..." />
    <StateTip v-else-if="commentTree.length === 0" type="empty" message="暂无评论，来说点什么吧" />
    <CommentItem
      v-for="comment in commentTree"
      :key="comment.id"
      :comment="comment"
      :depth="0"
      :current-user-id="currentUserId"
      @reply="handleReply"
      @remove="handleDelete"
    />
  </section>

  <!-- 固定底部输入栏 -->
  <div class="comment-bar">
    <div class="comment-bar-inner">
      <template v-if="isLogin">
        <p v-if="replyTarget" class="bar-reply-hint">
          回复 @{{ replyTarget.username }}
          <button class="cancel-reply" @click="cancelReply">取消</button>
        </p>
        <div class="bar-input-row">
          <el-input
            v-model="newComment"
            :placeholder="replyTarget ? '写下回复...' : '写下评论...'"
            maxlength="1000"
            @keyup.enter.exact="handleSubmit"
          />
          <el-button type="primary" size="small" :loading="submitLoading" @click="handleSubmit">
            发表
          </el-button>
        </div>
      </template>
      <p v-else class="bar-login-hint">
        <router-link to="/login">登录</router-link> 后参与评论
      </p>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.comment-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
}

.comment-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: var(--navbar-bg);
  border-top: 1px solid var(--border);
  box-shadow: 0 -2px 8px var(--shadow);
  padding: 10px 16px;
}
.comment-bar-inner {
  max-width: 760px;
  margin: 0 auto;
}
.bar-reply-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.cancel-reply {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
}
.cancel-reply:hover { color: #e74c3c; }
.bar-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.bar-login-hint {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
.bar-login-hint a { color: var(--primary); }
</style>
