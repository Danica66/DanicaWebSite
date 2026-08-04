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
    const sql = 'INSERT INTO users (username, password, email, email_verified) VALUES (?, ?, ?, 1)'
    db.query(sql, [user.username, user.password, user.email || null], (err, result:RowDataPacket[]) => {
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
    const sql = 'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?'
    db.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 更新用户资料（只更新传入的字段）
export const update_user =(id: number, profile: UserProfile): Promise<RowDataPacket[]>=>{
  return new Promise((resolve, reject) => {
    const sets: string[] = []
    const params: any[] = []

    if (profile.email !== undefined) {
      sets.push('email = ?')
      params.push(profile.email || null)
      // 邮箱变更时重置验证状态
      sets.push('email_verified = IF(email = ?, email_verified, 0)')
      params.push(profile.email || null)
    }
    if (profile.avatar !== undefined) {
      sets.push('avatar = ?')
      params.push(profile.avatar || null)
    }

    if (sets.length === 0) {
      resolve([] as any)
      return
    }

    params.push(id)
    const sql = `UPDATE users SET ${sets.join(', ')} WHERE id = ?`
    db.query(sql, params, (err, result: RowDataPacket[]) => {
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
