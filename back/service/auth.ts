import { UserLogin, UserProfile } from "../type"
import { insert_username_password, select_username, select_user_by_id, update_user } from "../database/DAO/auth" 
import { insert_email_code, select_latest_email_code, mark_email_code_used, increment_email_code_attempts, select_user_by_email, delete_email_code, clear_email_codes } from "../database/DAO/emailCode" 
import { compare, hash, sendCodeMail } from "../utils"
import { JwtPayload } from 'jsonwebtoken'
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils"
import { Cmail } from "../config/index"
import crypto from 'crypto'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_ATTEMPTS = 5

export const loginService=async (body:UserLogin)=>{
    const users =await select_username(body)
    if(users.length===0){
        throw new Error("用户名或密码错误")
    }
    const user=users[0]
    if(!await compare(body.password,user.password)){
        throw new Error("用户名或密码错误")
    }
    const userId = user.id
    const accesstoken = generateToken(userId)
    const refreshtoken =generateRefreshToken(userId)
    return {
    accesstoken,
    refreshtoken,
    userId,
    username: user.username,
    is_admin: user.is_admin || 0,
  }
}

// 发送注册验证码
export const sendCodeService=async (email:string)=>{
    if(!EMAIL_REGEX.test(email)){
        throw new Error('邮箱格式不正确')
    }
    // 邮箱已被注册 → 提示用户直接登录
    const existed = await select_user_by_email(email)
    if(existed.length > 0){
        throw new Error('该邮箱已被注册，请直接登录')
    }
    // 60 秒冷却：查最近一条记录
    const latest = await select_latest_email_code(email)
    if(latest.length > 0){
        const lastCreated = new Date(latest[0].created_at).getTime()
        const waitMs = Cmail.resendInterval * 1000 - (Date.now() - lastCreated)
        if(waitMs > 0){
            throw new Error(`发送过于频繁，请 ${Math.ceil(waitMs / 1000)} 秒后再试`)
        }
    }
    // 清理该邮箱的旧验证码，保持一人一码
    await clear_email_codes(email)
    // 生成 6 位验证码
    const code = crypto.randomInt(100000, 1000000).toString()
    const expiresAt = new Date(Date.now() + Cmail.codeExpiresIn * 1000)
    const inserted = await insert_email_code(email, code, expiresAt)
    try {
        await sendCodeMail(email, code)
    } catch (err) {
        // 发送失败：清理刚插入的记录，避免残留触发冷却
        await delete_email_code(inserted.insertId)
        console.error('邮件发送失败:', err)
        throw new Error('邮件发送失败，请检查 SMTP 配置')
    }
    return { email }
}

// 校验验证码
const verifyCode = async (email: string, code: string): Promise<void> => {
    if(!EMAIL_REGEX.test(email)){
        throw new Error('邮箱格式不正确')
    }
    if(!/^\d{6}$/.test(code)){
        throw new Error('验证码格式不正确')
    }
    const rows = await select_latest_email_code(email)
    if(rows.length === 0){
        throw new Error('请先获取验证码')
    }
    const record = rows[0]
    if(record.used){
        throw new Error('验证码已使用，请重新获取')
    }
    if(new Date(record.expires_at).getTime() < Date.now()){
        throw new Error('验证码已过期，请重新获取')
    }
    if(record.attempts >= MAX_ATTEMPTS){
        throw new Error('错误次数过多，请重新获取验证码')
    }
    if(record.code !== code){
        await increment_email_code_attempts(record.id)
        throw new Error('验证码错误')
    }
    await mark_email_code_used(record.id)
}

export const registerService=async (body:UserLogin, code:string)=>{
    if(!body.email || !code){
        throw new Error('邮箱和验证码不能为空')
    }
    const existing = await select_username(body)
    if (existing.length > 0) {
        throw new Error('用户名已存在')
    }
    // 邮箱唯一
    const emailExisted = await select_user_by_email(body.email)
    if (emailExisted.length > 0) {
        throw new Error('该邮箱已被注册')
    }
    // 校验验证码
    await verifyCode(body.email, code)
    const hashedPassword = await hash(body.password)
    const newuser:UserLogin = { ...body, password: hashedPassword }
    await insert_username_password(newuser)
    return { username: body.username }
}
export const refreshService=async(refreshtoken:string)=>{
    const decoded=verifyRefreshToken(refreshtoken) as JwtPayload
    if(!decoded){
        throw new Error('refreshtoken无效或过期,请重新登录')
    }
    const accesstoken=generateToken(decoded.userId)
    return {accesstoken}
}
export const getProfileService=async(userId:number)=>{
    const rows=await select_user_by_id(userId)
    if(rows.length===0){
        throw new Error('用户不存在')
    }
    const {password,...profile}=rows[0]
    return profile
}
export const updateProfileService=async(userId:number,profile:UserProfile)=>{
    return await update_user(userId,profile)
}
