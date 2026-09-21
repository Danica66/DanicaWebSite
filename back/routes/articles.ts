import { Router } from "express"
import { getArticleListController,getPublicArticleController,getTagsController} from "../controllers/article"
const router = Router()

router.get('', getArticleListController)//获取文章列表
router.get('/tags',getTagsController)//标签聚合（必须放在 /:id 之前，否则 tags 会被当成 id）
router.get('/:id',getPublicArticleController)//id获取文章（公开详情强制计数，不受 noCount 影响）


export default router
