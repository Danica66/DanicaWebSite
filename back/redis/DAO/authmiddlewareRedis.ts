import redis from "../redis"

export const authMiddlewareRedis = async (jti: string) => {
    return await redis.exists(`blog:accesstokenblacklist:${jti}`)
}