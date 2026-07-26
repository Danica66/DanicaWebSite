import { select_article,select_articlebyid,select_article_userid,insert_article,delete_articlebyid,update_article_viewcount,update_article } from "../database/DAO/article"
import { Article } from "../type"
export const getArticleListService=async (page:number,limit:number,keyword:string)=>{
    return await select_article(page,limit,keyword)
}
export const getSingleArticleService=async(id:number)=>{
    return await select_articlebyid(id)
}
export const releaseArticleService=async(article:Article)=>{
    return await insert_article(article)
}
export const updateArticleService=async(article:Article)=>{
    return await update_article(article)
}
export const deleteArticleService=async(id:number)=>{
    return await delete_articlebyid(id)
}