import { Router } from "express"
import { getArticleListController,getSingleArticleController} from "../controllers/article"
const router = Router()

router.get('', getArticleListController)//获取文章列表
router.get('/:id',getSingleArticleController)//id获取文章


export default router