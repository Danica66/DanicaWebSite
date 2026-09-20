import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UserPayload } from '../../shared/types'
import { authMiddlewareRedis } from '../redis/DAO/authmiddlewareRedis'

const PUBLIC_ROUTES = [
  { regex: /^\/admin\/auth\/login$/,    methods: ['POST'] },
  { regex: /^\/admin\/auth\/refresh$/,  methods: ['POST'] },
  { regex: /^\/admin\/auth\/logout$/,   methods: ['POST'] },
  { regex: /^\/api\/articles$/,       methods: ['GET'] },
  { regex: /^\/api\/rss$/,            methods: ['GET'] },
  { regex: /^\/api\/articles\/\d+$/, methods: ['GET'] },
  { regex: /^\/api\/images\/.+/,    methods: ['GET'] },
]

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  for (const route of PUBLIC_ROUTES) {
    if (route.regex.test(req.path) && route.methods.includes(req.method)) {
      return next()
    }
  }
  // 1. 从请求头获取 Authorization: Bearer <token>
  const tokenStr:string = req.headers.authorization?.split(' ')[1] || ''
  // 2. 如果没有token，返回 401
  if (!tokenStr) {
    return res.unauthorized('缺少 token')
  }
  // 3. 验证token是否有效
  const decoded = verifyToken(tokenStr) as UserPayload | null
  if (!decoded) {
    return res.unauthorized('token 无效或已过期')
  }
  // 4. 黑名单检查：命中则 token 已注销（Redis 不可用时 fail-open 放行，避免全站 401）
  const isBlacklisted = await authMiddlewareRedis(decoded.jti).catch(() => false)
  if (isBlacklisted) {
    return res.unauthorized('token 已被注销，请重新登录')
  }
  // 5. 有效且未注销，把用户信息挂到 req.user 上
  req.user = decoded
  next()
}