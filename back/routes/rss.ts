import { Router } from 'express'
import { rssController } from '../controllers/rss'

const router = Router()

router.get('', rssController)

export default router
