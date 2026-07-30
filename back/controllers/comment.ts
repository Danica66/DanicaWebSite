import { Request, Response } from 'express'
import { getCommentsService, createCommentService, deleteCommentService } from '../service/comment'

export const getCommentsController = async (req: Request, res: Response) => {
  const articleId = Number(req.params.id)
  if (!articleId) {
    return res.badRequest('文章 ID 无效')
  }
  try {
    const comments = await getCommentsService(articleId)
    return res.success(comments, '获取评论成功')
  } catch (err) {
    console.error('获取评论失败:', err)
    return res.internalError('获取评论失败')
  }
}

export const createCommentController = async (req: Request, res: Response) => {
  const articleId = Number(req.params.id)
  const { content, parent_id } = req.body
  if (!articleId) {
    return res.badRequest('文章 ID 无效')
  }
  if (!content) {
    return res.badRequest('评论内容不能为空')
  }
  try {
    await createCommentService(req.user.userId, articleId, content, parent_id || null)
    return res.success(null, '评论成功')
  } catch (err: any) {
    console.error('发表评论失败:', err)
    if (err?.message) {
      return res.badRequest(err.message)
    }
    return res.internalError('发表评论失败')
  }
}

export const deleteCommentController = async (req: Request, res: Response) => {
  const commentId = Number(req.params.id)
  if (!commentId) {
    return res.badRequest('评论 ID 无效')
  }
  try {
    await deleteCommentService(req.user.userId, commentId)
    return res.success(null, '删除评论成功')
  } catch (err: any) {
    console.error('删除评论失败:', err)
    if (err?.message) {
      return res.badRequest(err.message)
    }
    return res.internalError('删除评论失败')
  }
}
