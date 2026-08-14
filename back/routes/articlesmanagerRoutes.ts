import { Router } from "express"
import { getArticleListManagerController,getSingleArticleController,releaseArticleController,updateArticleController,deleteArticleController } from "../controllers/article"
const router = Router()

router.get('', getArticleListManagerController)//获取文章列表
router.get('/:id',getSingleArticleController)//id获取文章
router.post('',releaseArticleController)//创建文章
router.put('/:id',updateArticleController)//id修改
router.delete('/:id',deleteArticleController)//id删除

export default router