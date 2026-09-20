import { LoginParams, UserProfileUpdate } from "../../shared/types"
import { select_username, select_user_by_id, update_user } from "../database/DAO/auth" 
import { compare } from "../utils"
import { JwtPayload } from 'jsonwebtoken'
import { logoutServiceRedis, loginServiceRedis, refreshServiceRedis, removeRefreshSession } from "../redis/DAO/authServiceRedis"
import { generateToken, generateRefreshToken, verifyRefreshToken, decodeToken } from "../utils"

export const loginService = async (body: LoginParams) => {
    const users = await select_username(body)
    if (users.length === 0) {
        throw new Error("用户名或密码错误")
    }
    const user = users[0]
    if (!await compare(body.password, user.password)) {
        throw new Error("用户名或密码错误")
    }
    const userId = user.id
    const accesstoken = generateToken(userId)
    const { refreshtoken, jti } = generateRefreshToken(userId)
    await loginServiceRedis(userId, jti)
    return { accesstoken, refreshtoken, userId, is_admin: user.is_admin || 0 }
}

export const refreshService = async (oldrefreshtoken: string) => {
    const decoded = verifyRefreshToken(oldrefreshtoken) as JwtPayload
    if (!decoded) {
        throw new Error('refreshtoken无效或过期,请重新登录')
    }
    const userId = decoded.userId
    const oldJti = decoded.jti as string
    
    const accesstoken = generateToken(userId)
    const { refreshtoken, jti: newJti } = generateRefreshToken(userId)
    // 新旧判断：旧 token 的 jti 必须仍在白名单中，否则视为已轮换/注销/重放
    await refreshServiceRedis(userId, oldJti, newJti)
    return { accesstoken, refreshtoken }
}

export const loggoutService = async (accesstoken?: string, refreshtoken?: string) => {
    // 1. access token 进黑名单（best-effort，解析失败不影响登出）
    if (accesstoken) {
        const decoded = decodeToken(accesstoken) as JwtPayload | null
        if (decoded && typeof decoded.exp === 'number' && typeof decoded.jti === 'string') {
            const ddl = decoded.exp - Math.floor(Date.now() / 1000)
            if (ddl > 0) await logoutServiceRedis(decoded.jti, ddl)
        }
    }
    // 2. 删除 refresh 会话，登出后不能再换新 token
    if (refreshtoken) {
        const decoded = decodeToken(refreshtoken) as JwtPayload | null
        if (decoded && typeof decoded.userId === 'number' && typeof decoded.jti === 'string') {
            await removeRefreshSession(decoded.userId, decoded.jti)
        }
    }
}

export const getProfileService = async (userId: number) => {
    const rows = await select_user_by_id(userId)
    if (rows.length === 0) {
        throw new Error('用户不存在')
    }
    const { password, ...profile } = rows[0]
    return profile
}

export const updateProfileService = async (userId: number, profile: UserProfileUpdate) => {
    return await update_user(userId, profile)
}
