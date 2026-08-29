import { Router } from "express"
import { getArticleListController,getPublicArticleController} from "../controllers/article"
const router = Router()

router.get('', getArticleListController)//获取文章列表
router.get('/:id',getPublicArticleController)//id获取文章（公开详情强制计数，不受 noCount 影响）


export default router
