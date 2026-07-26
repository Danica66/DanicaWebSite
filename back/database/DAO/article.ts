import db from '../index'
import { RowDataPacket } from 'mysql2'
import { Article } from '../../type'
// 插入文章
export const insert_article =(article:Article): Promise<RowDataPacket[]>=>{
   return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO articles (title, content, summary, author_id) VALUES (?, ?, ?, ?)'

    
    db.query(sql, [article.title,article.content,article.summary,article.author_id], (err, result:RowDataPacket[]) => {
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
    const sql = 'SELECT id, title, content, author_id, view_count, created_at FROM articles WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
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
export const update_article=(article:Article):Promise<RowDataPacket[]>=>{
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE articles SET title = ?, content = ? WHERE id = ?'
    db.query(sql, [article.title,article.content,article.id], (err, result:RowDataPacket[]) => {
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