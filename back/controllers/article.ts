import { Request,Response } from "express"
import { getSingleArticleService,getArticleListService,updateArticleService,deleteArticleService,releaseArticleService } from "../service/article"
import { Article } from "../type"
export const getArticleListController=async (req:Request,res:Response)=>{
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const keyword = req.query.keyword as string
    if(!page){
        return res.badRequest('少参数page')
    }
    if(!limit){
        return res.badRequest('少参数limit')
    }
    if(!keyword){
        return res.badRequest('少参数keyword')
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
    const article:Article=req.body  
    if(!article){
        return res.badRequest('缺少文章体')
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
    if(!article){
        return res.badRequest('缺少文章更新体')
    }
    try {
        return res.success(await updateArticleService(article),`id:${id}更新文章成功`)
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
        return res.success(await deleteArticleService(id),`id:${id}删除文章成功`)
    } catch (err) {
        console.error('id删除文章失败:', err)
        return res.internalError('id删除文章失败')
    } 
}