import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { queryRows, queryExec } from '../query'
import { LoginParams, UserProfileUpdate } from '../../../shared/types'

// 查找用户
export const select_username = (user: LoginParams) =>
  queryRows<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [user.username])

// 根据 ID 查用户
export const select_user_by_id = (id: number) =>
  queryRows<RowDataPacket[]>(
    'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
    [id]
  )

// 更新用户资料（只更新传入的字段；未传入任何字段时不执行 SQL，返回 null）
export const update_user = async (
  id: number,
  profile: UserProfileUpdate
): Promise<ResultSetHeader | null> => {
  const sets: string[] = []
  const params: unknown[] = []

  if (profile.email !== undefined) {
    sets.push('email = ?')
    params.push(profile.email || null)
  }
  if (profile.avatar !== undefined) {
    sets.push('avatar = ?')
    params.push(profile.avatar || null)
  }

  if (sets.length === 0) return null

  params.push(id)
  return queryExec(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params)
}
