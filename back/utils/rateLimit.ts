import { rateLimit } from 'express-rate-limit'
import { error } from './response'

/**
 * 创建限流器的工厂函数，统一默认配置
 */
export const createLimiter = (windowMs: number, limit: number, message: string) => {
  return rateLimit({
    windowMs,
    limit,
    message: error(message, 429),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  })
}
