import { Router } from 'express'
import { uploadImageController } from '../controllers/upload'

const router = Router()

// 图片上传（需登录，由全局 authMiddleware 拦截未带 token 的请求）
router.post('', uploadImageController)

export default router
