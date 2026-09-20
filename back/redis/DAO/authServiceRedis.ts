import redis from '../redis'

const REFRESH_TTL = 7 * 24 * 60 * 60 // 7 天，与 refresh token 寿命一致

// 每个用户一个 Set，成员是该用户所有"当前有效"的 refresh token 的 jti
const sessionKey = (userId: number) => `blog:refreshtokenwhitelist:${userId}`



export const loginServiceRedis = async (userId: number, jti: string) => {
    try {
        await redis.sadd(sessionKey(userId), jti)
        await redis.expire(sessionKey(userId), REFRESH_TTL)
    } catch (error) {
        console.error('Redis 会话登记失败:', error)
    }
}
export const logoutServiceRedis = async (jti: string, ddl: number) => {
    try {
        // 黑名单条目：SETEX 原子写入并设过期，TTL = access token 剩余寿命
        await redis.setex(`blog:accesstokenblacklist:${jti}`, ddl, '1')
    } catch (error) {
        console.error('Redis 黑名单写入失败:', error)
    }
}

export const refreshServiceRedis = async (userId: number, oldJti: string, newJti: string) => {
    if ((await redis.sismember(sessionKey(userId), oldJti)) !== 1) {
        throw new Error('refresh token 已失效，请重新登录')
    }

    // 轮换：先登记新 jti，再移除旧 jti
    try {
        await redis.sadd(sessionKey(userId), newJti)
        await redis.expire(sessionKey(userId), REFRESH_TTL)
        await redis.srem(sessionKey(userId), oldJti)
    } catch (error) {
        console.error('Redis 会话登记失败:', error)
    }

}


// 轮换/登出时移除指定会话
export const removeRefreshSession = async (userId: number, jti: string) => {
    try {
        await redis.srem(sessionKey(userId), jti)
    } catch (error) {
        console.error('Redis 会话移除失败:', error)
    }
}


export default { logoutServiceRedis, removeRefreshSession, loginServiceRedis, refreshServiceRedis }
