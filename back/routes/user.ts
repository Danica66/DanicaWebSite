import { Router } from 'express'
import { getProfileController, updateProfileController, sendChangeEmailCodeController } from '../controllers/auth'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

router.get('/profile', getProfileController)
router.put('/profile', updateProfileController)
router.post('/send-code', authLimiter, sendChangeEmailCodeController)

export default router
