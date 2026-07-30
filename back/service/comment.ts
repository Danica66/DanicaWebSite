import { select_comments_by_article, insert_comment, select_comment_by_id, delete_comment_by_id } from '../database/DAO/comment'

export const getCommentsService = async (articleId: number) => {
  return await select_comments_by_article(articleId)
}

export const createCommentService = async (
  userId: number,
  articleId: number,
  content: string,
  parentId: number | null = null
) => {
  if (!content || !content.trim()) {
    throw new Error('评论内容不能为空')
  }
  if (content.trim().length > 1000) {
    throw new Error('评论不能超过 1000 字')
  }
  // 如果指定了父评论，检查它是否存在且属于同一文章
  if (parentId) {
    const rows = await select_comment_by_id(parentId)
    if (rows.length === 0) {
      throw new Error('回复的评论不存在')
    }
    const parent = rows[0] as any
    if (parent.article_id !== articleId) {
      throw new Error('文章 ID 不匹配')
    }
  }
  await insert_comment({
    article_id: articleId,
    user_id: userId,
    parent_id: parentId,
    content: content.trim(),
  })
  return null
}

export const deleteCommentService = async (userId: number, commentId: number) => {
  const rows = await select_comment_by_id(commentId)
  if (rows.length === 0) {
    throw new Error('评论不存在')
  }
  const comment = rows[0] as any
  if (comment.user_id !== userId) {
    throw new Error('只能删除自己的评论')
  }
  await delete_comment_by_id(commentId)
  return null
}
