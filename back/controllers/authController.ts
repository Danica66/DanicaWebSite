import {hash,compare,generateRefreshToken,generateToken,verifyRefreshToken,verifyToken} from '../utils'
import { Request, Response } from 'express'
import { UserLogin } from '../type/index'
import { select_username,insert_username_password } from '../database/DAO/auth'

// 登录逻辑
export const login = async (req: Request, res: Response) => {
    const body:UserLogin=req.body
    const username=body.username
    const password=body.password
    if(!username||!password){
        res.badRequest("用户名或密码不能为空")
    }
    try {
        const users =await select_username(body)
        if(users.length===0){
            return res.unauthorized("用户名或密码错误")
        }
        const user=users[0]
        if(!compare(password,user.password)){
            return res.unauthorized("用户名和密码错误")
        }
        
        const userId = String(user.id)
        const accessToken = "Bearer "+generateToken(userId)
        const refreshToken ="Bearer "+generateRefreshToken(userId)
        
        return res.success({
            accessToken,
            refreshToken,
            userId,
            username: user.username,}, '登录成功')
    } catch (err) {
        console.error('登录失败:', err)
        return res.internalError('登录失败，请稍后重试')
    }
    
}

// 注册逻辑
export const register = async(req: Request, res: Response) => {
    const body: UserLogin = req.body;
    const username=body.username
    const password=body.password
    if (!username || !password) {
        return res.badRequest('用户名和密码不能为空')
    }

    try {
        // 1. 检查用户是否已存在
        const existing = await select_username(body)

        if (existing.length > 0) {
        return res.badRequest('用户名已存在')
        }

        // 2. 加密密码
        const hashedPassword =hash(password)

        // 3. 创建用户（调用 DAO 层）
        const newuser:UserLogin={
            username:username,
            password:hashedPassword
        }
        await insert_username_password(newuser)

        return res.success({ username }, '注册成功')
    } catch (err) {
        console.error('注册失败:', err)
        return res.internalError('注册失败，请稍后重试')
    }
}
