import { Router } from 'express'
import { getCommentsController, createCommentController, deleteCommentController } from '../controllers/comment'

const router = Router()

router.get('/articles/:id/comments', getCommentsController)
router.post('/articles/:id/comments', createCommentController)
router.delete('/comments/:id', deleteCommentController)

export default router
