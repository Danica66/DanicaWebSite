import { Router } from 'express'
import { uploadMiddleware } from '../middleware/upload'
import { uploadAvatarController } from '../controllers/upload'

const router = Router()

router.post('/', uploadMiddleware, uploadAvatarController)

export default router
