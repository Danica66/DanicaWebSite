import { Request,Response } from "express"
import { getSingleArticleService,getArticleListService,updateArticleService,deleteArticleService,releaseArticleService} from "../service/article"
import { Article, Articlestatus } from "../type"
//公共接口controller
export const getArticleListController=async (req:Request,res:Response)=>{
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const keyword = req.query.keyword as string
    if (!page || page < 1) {
        return res.error('page 必须 >= 1')
    }
    if (!limit || limit < 1 || limit > 100) {
        return res.error('limit 必须为 1–100')
    }
    try {
        return res.success(await getArticleListService(page,limit,keyword,'published'),`获取文章成功`)
    } catch (err: any) {
        console.error('获取文章失败:', err)
        return res.error(err.message || '获取文章失败', 1, 500)
    }
}
//管理员接口controller
export const getArticleListManagerController=async (req:Request,res:Response)=>{
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const keyword = req.query.keyword as string
    const status=req.query.status as Articlestatus
    if (!page || page < 1) {
        return res.error('page 必须 >= 1')
    }
    if (!limit || limit < 1 || limit > 100) {
        return res.error('limit 必须为 1–100')
    }
    try {
        return res.success(await getArticleListService(page,limit,keyword,status),`获取${status}文章成功`)
    } catch (err: any) {
        console.error('获取文章失败:', err)
        return res.error(err.message || '获取文章失败', 1, 500)
    }
}
export const getSingleArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)
    if (!id) {
        return res.error('缺少文章 ID')
    }
    try {
        // 管理台编辑/预览请求带 ?noCount=1，不计入阅读数
        const countView = req.query.noCount !== '1'
        return res.success(await getSingleArticleService(id, countView),`id:${id}查找文章成功`)
    } catch (err: any) {
        console.error('id查找文章失败:', err)
        return res.error(err.message || 'id查找文章失败', 1, 500)
    }
}
export const releaseArticleController=async(req:Request,res:Response)=>{
    const article:Article={
        title:req.body.title,
        content:req.body.content,
        summary: req.body.summary,
        cover_image: req.body.cover_image,
        status: req.body.status,
        author_id: req.user.userId
    }
    if (!article.title || !article.content) {
        return res.error('缺少文章标题或内容')
    }
    try {
        return res.success(await releaseArticleService(article),'发布文章成功')
    } catch (err: any) {
        console.error('发布文章失败:', err)
        return res.error(err.message || '发布文章失败', 1, 500)
    }
}
export const updateArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)
    if (!id) {
        return res.error('缺少文章 ID')
    }
    const article:Article=req.body
    if (!article.title || !article.content) {
        return res.error('缺少文章标题或内容')
    }
    try {
        return res.success(await updateArticleService(req.user.userId,id,article),`id:${id}更新文章成功`)
    } catch (err: any) {
        console.error('id更新文章失败:', err)
        return res.error(err.message || 'id更新文章失败', 1, 500)
    }
}
export const deleteArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)
    if (!id) {
        return res.error('缺少文章 ID')
    }
    try {
        return res.success(await deleteArticleService(req.user.userId,id),`id:${id}删除文章成功`)
    } catch (err: any) {
        console.error('id删除文章失败:', err)
        return res.error(err.message || 'id删除文章失败', 1, 500)
    }
}

