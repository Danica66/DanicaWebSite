import { Router } from "express"
import { getArticleListController,getSingleArticleController,releaseArticleController,updateArticleController,deleteArticleController,getMyArticlesController } from "../controllers/article"
const router = Router()

router.get('', getArticleListController)
router.get('/mine', getMyArticlesController)        // /mine 必须在 /:id 之前，否则会被当作 id
router.get('/:id',getSingleArticleController)
router.post('',releaseArticleController)
router.put('/:id',updateArticleController)
router.delete('/:id',deleteArticleController)

export default router