import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UserPayload } from '../type'
import R from '../utils/response'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. 从请求头获取 Authorization: Bearer <token>
  // 2. 如果没有token，返回 401
  // 3. 验证token是否有效
  // 4. 如果有效，把用户信息挂到 req.user 上
  // 5. 调用 next()
  const tokenStr:string = req.headers.authorization?.split(' ')[1] || ''
  if (!tokenStr) {
    return res.status(401).json(R.error('未授权', 401))
  }else{
    const decoded = verifyToken(tokenStr) as UserPayload || null
    if (!decoded) {
    return res.status(401).json(R.error('未授权：token 无效或已过期', 401))
  }
    req.user = decoded
    next()
  }
}