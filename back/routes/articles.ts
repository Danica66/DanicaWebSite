import { Router } from "express"
import { getArticleListController,getSingleArticleController,releaseArticleController,updateArticleController,deleteArticleController } from "../controllers/article"
const router = Router()

router.get('', getArticleListController)
router.get('/:id',getSingleArticleController)
router.post('',releaseArticleController)
router.put('/:id',updateArticleController)
router.delete('/:id',deleteArticleController)

export default router