import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UserPayload } from '../type'

// ===== 白名单配置（支持通配符 *） =====
const PUBLIC_PATTERNS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/health',
  '/public/*',        // /public/ 下的所有路径
  '/uploads/*',       // /uploads/ 下的所有路径
  '*.html',           // 所有 .html 文件
  '*.css',            // 所有 .css 文件
  '*.js',             // 所有 .js 文件
]

// 通配符匹配函数
const matchPattern = (path: string, pattern: string): boolean => {
  // 精确匹配
  if (pattern === path) return true
  
  // 通配符 * 匹配
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2)  // 去掉 /*
    return path.startsWith(prefix)
  }
  
  // 后缀匹配（如 *.html）
  if (pattern.startsWith('*.')) {
    const ext = pattern.slice(1)  // 得到 .html
    return path.endsWith(ext)
  }
   return false
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 检查是否匹配白名单
  for (const pattern of PUBLIC_PATTERNS) {
    if (matchPattern(req.path, pattern)) {
      return next()  // 放行
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