import db from '../index'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

// 插入验证码记录
export const insert_email_code = (email: string, code: string, expiresAt: Date): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO email_codes (email, code, expires_at) VALUES (?, ?, ?)'
    db.query(sql, [email, code, expiresAt], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 查询某邮箱最近一条未使用的验证码记录（用于重发冷却判断与校验）
export const select_latest_email_code = (email: string): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM email_codes WHERE email = ? ORDER BY id DESC LIMIT 1'
    db.query(sql, [email], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 校验通过后标记为已使用
export const mark_email_code_used = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE email_codes SET used = 1 WHERE id = ?'
    db.query(sql, [id], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 记录一次错误尝试
export const increment_email_code_attempts = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?'
    db.query(sql, [id], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 删除验证码记录（发送失败时清理，避免残留触发冷却）
export const delete_email_code = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM email_codes WHERE id = ?'
    db.query(sql, [id], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 清理某邮箱的所有验证码（重发前调用，保持一人一码）
export const clear_email_codes = (email: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM email_codes WHERE email = ?'
    db.query(sql, [email], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 按邮箱查用户（注册时判断邮箱是否已被注册）
export const select_user_by_email = (email: string): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE email = ?'
    db.query(sql, [email], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export default {
  insert_email_code,
  select_latest_email_code,
  mark_email_code_used,
  increment_email_code_attempts,
  delete_email_code,
  clear_email_codes,
  select_user_by_email,
}
