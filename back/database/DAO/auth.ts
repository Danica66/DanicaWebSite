import db from '../index'
import { RowDataPacket } from 'mysql2'
import { UserLogin } from '../../type/index'
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
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)'
    db.query(sql, [user.username, user.password], (err, result:RowDataPacket[]) => {
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