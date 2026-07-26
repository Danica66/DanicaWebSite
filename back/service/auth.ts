import { UserLogin } from "../type"
import { insert_username_password,select_username } from "../database/DAO/auth" 
import { compare,hash } from "../utils"
import { JwtPayload } from 'jsonwebtoken'
import { generateToken,generateRefreshToken,verifyRefreshToken } from "../utils"

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
  }
}
export const registerService=async (body:UserLogin,username:string,password:string)=>{
    const existing = await select_username(body)
    if (existing.length > 0) {
        throw new Error('用户名已存在')
    }
    const hashedPassword =await hash(password)
    const newuser:UserLogin={
        username:username,
        password:hashedPassword
    }
    await insert_username_password(newuser)
    return { username }
}
export const refreshService=async(refreshtoken:string)=>{
    const decoded=verifyRefreshToken(refreshtoken) as JwtPayload
    if(!decoded){
        throw new Error('refreshtoken无效或过期,请重新登录')
    }
    const accesstoken=generateToken(decoded.userId)
    return {accesstoken}
}