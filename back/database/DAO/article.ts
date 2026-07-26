import db from '../index'
import { RowDataPacket } from 'mysql2'
import { Article } from '../../type'
// 插入文章
export const insert_article =(article:Article): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const status = article.status === 'published' ? 'published' : 'draft'
    const sql = 'INSERT INTO articles (title, content, summary, author_id, status) VALUES (?, ?, ?, ?, ?)'
    db.query(sql, [article.title, article.content, article.summary, article.author_id, status], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 查找文章(分页)
export const select_article =(page:number,limit:number,keyword:string): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit
    const sql = 'SELECT id, title, content, author_id, view_count, created_at FROM articles WHERE status = \'published\' AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT ? OFFSET ?'
    db.query(sql, [`%${keyword}%`,`%${keyword}%`,limit,offset], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
//id查找文章
export const select_articlebyid =(id:number): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'select * from articles where id = ?'
    db.query(sql, [id], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
//id删除文章
export const delete_articlebyid =(id:number): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'delete from articles where id = ?'
    db.query(sql, [id], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
//更新文章
export const update_article=(article:Article,id:number):Promise<RowDataPacket[]>=>{
  return new Promise((resolve, reject) => {
    const status = article.status === 'published' ? 'published' : 'draft'
    const sql = 'UPDATE articles SET title = ?, content = ?, status = ? WHERE id = ?'
    db.query(sql, [article.title, article.content, status, id], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
//增加游览量
export const update_article_viewcount =(id:number): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'UPDATE articles SET view_count = view_count + 1 WHERE id = ?'
    db.query(sql, [id], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// RSS: 获取最近文章（不需要分页，需要摘要）
export const select_articles_rss =(limit:number = 20): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'SELECT id, title, summary, created_at FROM articles WHERE status = \'published\' ORDER BY created_at DESC LIMIT ?'
    db.query(sql, [limit], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 查看自己的文章（含草稿）
export const select_articles_mine =(authorId:number, status?:string): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    let sql = 'SELECT id, title, summary, status, view_count, created_at FROM articles WHERE author_id = ?'
    const params: any[] = [authorId]
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }
    sql += ' ORDER BY created_at DESC'
    db.query(sql, params, (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
//查看某文章的userid
export const select_article_userid=(id:number): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'SELECT author_id FROM articles WHERE id = ?'
    db.query(sql, [id], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}