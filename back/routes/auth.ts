import { Router } from 'express'
import { loginController, refreshController } from '../controllers/auth.ts'

const router = Router()

router.post('/login', loginController)
router.post('/refresh', refreshController)

export default router
