import { Request, Response } from 'express'
import { UserLogin } from '../type/index'
import { loginService, refreshService, registerService, getProfileService, updateProfileService } from '../service/auth'


export const loginController = async (req: Request, res: Response) => {
    const body:UserLogin=req.body
    const username=body.username
    const password=body.password
    if(!username||!password){
        return res.badRequest("用户名或密码不能为空")
    }
    try {
        return res.success(await loginService(body), '登录成功')
    } catch (err) {
        console.error('登录失败:', err)
        if (err?.message) {
            return res.badRequest(err.message)
        }
        return res.internalError('登录失败，请稍后重试')
    }
}
export const registerController = async(req: Request, res: Response) => {
    const body: UserLogin = req.body;
    const username=body.username
    const password=body.password
    if (!username || !password) {
        return res.badRequest('用户名和密码不能为空')
    }
    try {
        return res.success(await registerService(body), '注册成功')
    } catch (err) {
        console.error('注册失败:', err)
        if (err?.message === '用户名已存在') {
            return res.badRequest(err.message)
        }
        return res.internalError('注册失败，请稍后重试')
    }
}

export const refreshController=async(req:Request,res:Response)=>{
    const {refreshtoken}=req.body
    if(!refreshtoken){
        return res.badRequest('缺少refreshtoken')
    }
    try {
        return res.success(await refreshService(refreshtoken),'刷新成功')
    } catch (error) {
        console.error('刷新失败:', error)
        return res.internalError('刷新失败，请稍后重试')
    }
}
export const getProfileController=async(req:Request,res:Response)=>{
    try {
        const profile=await getProfileService(req.user.userId)
        return res.success(profile,'获取用户信息成功')
    } catch (err) {
        console.error('获取用户信息失败:', err)
        return res.internalError('获取用户信息失败')
    }
}
export const updateProfileController=async(req:Request,res:Response)=>{
    const {nickname,email,avatar}=req.body
    try {
        await updateProfileService(req.user.userId,{nickname,email,avatar})
        return res.success(null,'更新用户信息成功')
    } catch (err) {
        console.error('更新用户信息失败:', err)
        return res.internalError('更新用户信息失败')
    }
}