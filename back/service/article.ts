import { select_article,select_article_count,select_articlebyid,select_article_userid,insert_article,delete_articlebyid,update_article_viewcount,update_article,select_articles_mine } from "../database/DAO/article"
import { Article } from "../type"
export const getArticleListService=async (page:number,limit:number,keyword:string)=>{
    const [list, countResult] = await Promise.all([
        select_article(page, limit, keyword),
        select_article_count(keyword),
    ])
    const total = (countResult[0] as any).total || 0
    return { list, total }
}
export const getSingleArticleService=async(id:number)=>{
    await update_article_viewcount(id)
    const rows = await select_articlebyid(id)
    return rows[0] || null
}
export const releaseArticleService=async(article:Article)=>{
    return await insert_article(article)
}
export const updateArticleService=async(userId:number,id:number,article:Article)=>{
    const row=await select_article_userid(id)
    if(row.length===0){
        throw new Error('文章不存在')
    }
    if(userId!==row[0].author_id){
        throw new Error('无权限操作')
    }
    return await update_article(article,id)
}
export const deleteArticleService=async(userId:number,id:number)=>{
    const row=await select_article_userid(id)
    if(row.length===0){
        throw new Error('文章不存在')
    }
    if(userId!==row[0].author_id){
        throw new Error('无权限操作')
    }
    return await delete_articlebyid(id)
}
export const getMyArticlesService=async(authorId:number, status?:string)=>{
    return await select_articles_mine(authorId, status)
}