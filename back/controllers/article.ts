import { Request,Response } from "express"
import { getSingleArticleService,getArticleListService,updateArticleService,deleteArticleService,releaseArticleService,getMyArticlesService } from "../service/article"
import { Article } from "../type"
export const getArticleListController=async (req:Request,res:Response)=>{
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const keyword = req.query.keyword as string
    if (!page || page < 1) {
        return res.badRequest('page 必须 >= 1')
    }
    if (!limit || limit < 1 || limit > 100) {
        return res.badRequest('limit 必须为 1–100')
    }
    try {
        return res.success(await getArticleListService(page,limit,keyword),'获取文章成功')
    } catch (err) {
        console.error('获取文章失败:', err)
        return res.internalError('获取文章失败')
    }
}
export const getSingleArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)
    if (!id) {
        return res.badRequest('缺少文章 ID')
    }
    try {
        return res.success(await getSingleArticleService(id),`id:${id}查找文章成功`)
    } catch (err) {
        console.error('id查找文章失败:', err)
        return res.internalError('id查找文章失败')
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
        return res.badRequest('缺少文章标题或内容')
    }
    try {
        return res.success(await releaseArticleService(article),'发布文章成功')
    } catch (err) {
        console.error('发布文章失败:', err)
        return res.internalError('发布文章失败')
    }
}
export const updateArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)  
    if (!id) {
        return res.badRequest('缺少文章 ID')
    }
    const article:Article=req.body  
    if (!article.title || !article.content) {
        return res.badRequest('缺少文章标题或内容')
    }
    try {
        return res.success(await updateArticleService(req.user.userId,id,article),`id:${id}更新文章成功`)
    } catch (err) {
        console.error('id更新文章失败:', err)
        return res.internalError('id更新文章失败')
    } 
}
export const deleteArticleController=async(req:Request,res:Response)=>{
    const id = parseInt(req.params.id as string)
    if (!id) {
        return res.badRequest('缺少文章 ID')
    }
    try {
        return res.success(await deleteArticleService(req.user.userId,id),`id:${id}删除文章成功`)
    } catch (err) {
        console.error('id删除文章失败:', err)
        return res.internalError('id删除文章失败')
    } 
}
export const getMyArticlesController=async(req:Request,res:Response)=>{
    const status = req.query.status as string | undefined
    // 只允许 draft 或 published，其他值忽略
    if (status && status !== 'draft' && status !== 'published') {
        return res.badRequest('status 参数只能是 draft 或 published')
    }
    try {
        const articles = await getMyArticlesService(req.user.userId, status)
        return res.success(articles, '获取我的文章成功')
    } catch (err) {
        console.error('获取我的文章失败:', err)
        return res.internalError('获取我的文章失败')
    }
}