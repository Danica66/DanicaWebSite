import db from '../index'
import { RowDataPacket } from 'mysql2'
import { Comment } from '../../type'

// 获取某篇文章的所有评论（join 用户表拿用户名和头像）
export const select_comments_by_article = (articleId: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.id, c.article_id, c.user_id, c.parent_id, c.content, c.created_at, c.updated_at,
             u.username, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ?
      ORDER BY c.created_at ASC
    `
    db.query(sql, [articleId], (err, result: RowDataPacket[]) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// 插入一条评论
export const insert_comment = (comment: Comment): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO comments (article_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)'
    db.query(sql, [comment.article_id, comment.user_id, comment.parent_id, comment.content], (err, result: RowDataPacket[]) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// 按 id 查单条评论（用于权限校验）
export const select_comment_by_id = (id: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM comments WHERE id = ?'
    db.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// 删除评论
export const delete_comment_by_id = (id: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM comments WHERE id = ?'
    db.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// 删除文章时顺带删掉所有评论（级联清理）
export const delete_comments_by_article = (articleId: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM comments WHERE article_id = ?'
    db.query(sql, [articleId], (err, result: RowDataPacket[]) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
