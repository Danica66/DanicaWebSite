import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UserPayload } from '../type'

// ===== 白名单配置 =====
const PUBLIC_ROUTES = [
  { path: '/api/auth/login', methods: ['POST'] },
  { path: '/api/auth/register', methods: ['POST'] },
  { path: '/api/auth/refresh', methods: ['POST'] },
  { path: '/api/articles', methods: ['GET'] },
]

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 检查白名单（路径 + 方法）
  for (const route of PUBLIC_ROUTES) {
    if (route.path === req.path && route.methods.includes(req.method)) {
      return next()
    }
  }
  // 1. 从请求头获取 Authorization: Bearer <token>
  const tokenStr:string = req.headers.authorization?.split(' ')[1] || ''
  // 2. 如果没有token，返回 401
  if (!tokenStr) {
    return res.unauthorized('缺少 token')
  }else{
    // 3. 验证token是否有效
    const decoded = verifyToken(tokenStr) as UserPayload || null
    // 4. 如果有效，把用户信息挂到 req.user 上
    if (!decoded) {
      return res.unauthorized('token 无效或已过期')
    }
    req.user = decoded
    // 5. 调用 next()
    next()
  }
}