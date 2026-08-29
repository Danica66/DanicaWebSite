import { LoginParams, UserProfileUpdate } from "../../shared/types"
import { select_username, select_user_by_id, update_user } from "../database/DAO/auth" 
import { compare } from "../utils"
import { JwtPayload } from 'jsonwebtoken'
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils"
import { log } from "console"

export const loginService=async (body:LoginParams)=>{
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
    return {accesstoken,refreshtoken,userId,is_admin: user.is_admin || 0,}
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
export const updateProfileService=async(userId:number,profile:UserProfileUpdate)=>{
    return await update_user(userId,profile)
}
