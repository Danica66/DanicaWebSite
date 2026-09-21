import { select_article,select_article_count,select_articlebyid,insert_article,delete_articlebyid,update_article_viewcount,update_article,select_tags} from "../database/DAO/article"
import { Article, ArticleStatus } from "../../shared/types"

// 标签列占位默认值 'EMPTY STRING' 等同于“没有标签”
const cleanTag = (v: unknown) => (v && v !== 'EMPTY STRING' ? String(v) : '')

export const getArticleListService=async (page:number,limit:number,keyword:string,status:ArticleStatus='published',tag='')=>{
    const [list, countResult] = await Promise.all([
        select_article(page, limit, keyword,status,tag),
        select_article_count(keyword,status,tag),
    ])
    const total = (countResult[0] as any).total || 0
    return { list, total }
}
export const getTagsService=async ()=>{
    return await select_tags()
}
export const getSingleArticleService=async(id:number, countView: boolean = true)=>{
    if (countView) await update_article_viewcount(id)
    const rows = await select_articlebyid(id)
    const row = rows[0] as any
    return row ? { ...row, tag: cleanTag(row.tag) } : null
}
export const releaseArticleService=async(article:Article)=>{
    return await insert_article(article)
}
export const updateArticleService=async(id:number,article:Article)=>{
    const row=await select_articlebyid(id)
    if(row.length===0){
        throw new Error('文章不存在')
    }

    return await update_article(article,id)
}
export const deleteArticleService=async(id:number)=>{
    const row=await select_articlebyid(id)
    if(row.length===0){
        throw new Error('文章不存在')
    }
    return await delete_articlebyid(id)
}
