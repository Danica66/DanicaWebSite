import { Router } from 'express'
import { getProfileController, updateProfileController } from '../controllers/auth'

const router = Router()

router.get('/profile', getProfileController)
router.put('/profile', updateProfileController)

export default router
