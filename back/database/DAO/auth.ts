import db from '../index'
import { RowDataPacket } from 'mysql2'
import { UserLogin, UserProfile } from '../../type/index'
//查找用户
export const select_username=(user: UserLogin): Promise<RowDataPacket[]> =>{
    return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?'
    db.query(sql, [user.username], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 插入用户密码
export const insert_username_password=(user: UserLogin): Promise<RowDataPacket[]>=>{
     return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (username, password, nickname, email) VALUES (?, ?, ?, ?)'
    db.query(sql, [user.username, user.password, user.nickname || null, user.email || null], (err, result:RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 根据 ID 查用户
export const select_user_by_id =(id: number): Promise<RowDataPacket[]>=>{
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, nickname, email, avatar, created_at FROM users WHERE id = ?'
    db.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 更新用户资料
export const update_user =(id: number, profile: UserProfile): Promise<RowDataPacket[]>=>{
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET nickname = ?, email = ?, avatar = ? WHERE id = ?'
    db.query(sql, [profile.nickname || null, profile.email || null, profile.avatar || null, id], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
export default {
    select_username,
    insert_username_password
}