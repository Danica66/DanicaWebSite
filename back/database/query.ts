import db from './index'
import { QueryValues, ResultSetHeader, RowDataPacket } from 'mysql2'

// mysql2 Promise 化连接池：错误自动 reject，DAO 无需再手写回调样板
const pool = db.promise()

/**
 * 行查询（SELECT / COUNT 等），返回数据行数组。
 * mysql2 只允许把「行类型」作为泛型约束，因此 T 需继承 RowDataPacket[]。
 */
export async function queryRows<T extends RowDataPacket[] = RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const [rows] =
    params === undefined
      ? await pool.query<T>(sql)
      : await pool.query<T>(sql, params as QueryValues)
  return rows
}

/**
 * 写操作（INSERT / UPDATE / DELETE），返回 ResultSetHeader
 * （可用 affectedRows / insertId 判断影响行数与自增 ID）。
 */
export async function queryExec(sql: string, params?: unknown[]): Promise<ResultSetHeader> {
  const [result] =
    params === undefined
      ? await pool.query<ResultSetHeader>(sql)
      : await pool.query<ResultSetHeader>(sql, params as QueryValues)
  return result
}
