import { Router } from 'express'
import { loginController, registerController ,refreshController, sendCodeController } from '../controllers/auth.ts'

const router = Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.post('/refresh', refreshController)
router.post('/send-code', sendCodeController)

export default router
