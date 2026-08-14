import { select_article,select_article_count,select_articlebyid,select_article_userid,insert_article,delete_articlebyid,update_article_viewcount,update_article} from "../database/DAO/article"
import { Article, Articlestatus } from "../type"
export const getArticleListService=async (page:number,limit:number,keyword:string,status:Articlestatus='published')=>{
    const [list, countResult] = await Promise.all([
        select_article(page, limit, keyword,status),
        select_article_count(keyword,status),
    ])
    const total = (countResult[0] as any).total || 0
    return { list, total }
}
export const getSingleArticleService=async(id:number, countView: boolean = true)=>{
    if (countView) await update_article_viewcount(id)
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
