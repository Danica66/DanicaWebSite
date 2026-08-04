import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UserPayload } from '../type'

const PUBLIC_ROUTES = [
  { regex: /^\/api\/auth\/login$/,    methods: ['POST'] },
  { regex: /^\/api\/auth\/register$/, methods: ['POST'] },
  { regex: /^\/api\/auth\/refresh$/,  methods: ['POST'] },
  { regex: /^\/api\/auth\/send-code$/, methods: ['POST'] },
  { regex: /^\/api\/articles$/,       methods: ['GET'] },
  { regex: /^\/api\/rss$/,            methods: ['GET'] },
  { regex: /^\/api\/articles\/\d+$/, methods: ['GET'] },
  { regex: /^\/api\/avatars\/.+/,   methods: ['GET'] },
  { regex: /^\/api\/articles\/\d+\/comments$/, methods: ['GET'] },
]

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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