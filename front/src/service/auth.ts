import { authApi } from "@/api/handleapi"

export const authService={
    async login(username:string,password:string){
        if(!username||!password){
            throw new Error("用户名密码不能为空")
        }
        const res=await authApi.login({username,password})
        const {accesstoken,refreshtoken,userId,username: serverUsername}=res.data
        return {accesstoken,refreshtoken,user:{id:userId,name:serverUsername}}
    },
    async register(username:string,password:string){
        if(!username||!password){
            throw new Error("用户名密码不能为空")
        }
        await authApi.register({username,password})
    },
    async refresh(refreshtoken:string){
        if(!refreshtoken){
            throw new Error('空refreshtoken')
        }
        const res=await authApi.refresh({refreshtoken})
        const {accesstoken} =res.data
        return {accesstoken} 
    }
}