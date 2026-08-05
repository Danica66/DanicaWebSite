import { createLimiter } from '../utils/rateLimit'

/** 登录/注册：1 分钟内最多 5 次（防暴力破解） */
export const authLimiter = createLimiter(1 * 60 * 1000, 5, '请求过于频繁，请 1 分钟后再试')

/** 公开文章：15 分钟内最多 100 次（防爬虫） */
export const publicLimiter = createLimiter(15 * 60 * 1000, 100, '请求过于频繁，请 15 分钟后再试')

/** 评论：1 分钟内最多 10 次 */
export const commentLimiter = createLimiter(1 * 60 * 1000, 10, '评论过于频繁，请稍后再说')

/** 全局兜底：15 分钟内最多 200 次 */
export const globalLimiter = createLimiter(15 * 60 * 1000, 200, '请求过于频繁，请稍后重试')
