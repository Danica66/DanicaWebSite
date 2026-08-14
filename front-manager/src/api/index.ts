import { useauthStore } from "@/stores/auth";
import axios from "axios";
import { ElMessage } from "element-plus";
import type { ApiResponse } from "@/types";

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = parseInt(import.meta.env.VITE_TIMEOUT, 10) || 10000

const instance = axios.create({
  baseURL,
  timeout,
})

instance.interceptors.request.use(
    (config)=>{
        //访问header加token
        const authstore=useauthStore()
        if(authstore.accesstoken){
            config.headers.Authorization=`Bearer ${authstore.accesstoken}`
        }
        return config
    },
    (err)=>{
        return Promise.reject(err)
    }
)
instance.interceptors.response.use(
    (res)=>{
        return res.data
    },
    async (err)=>{//401自动刷新,无效则return
        const req=err.config
        const isRefreshReq = req.url?.includes('/auth/refresh')
        if(!isRefreshReq && err.response?.status===401 && !req._retry){
            req._retry=true
            const authstore=useauthStore()
            try {
                await authstore.refresh()
                req.headers.Authorization=`Bearer ${authstore.accesstoken}`
                return instance(req)
            }catch{
                ElMessage.warning('登录已过期，请重新登录')
                await authstore.logout()
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

//封装api方法
export function Get<T = any>(url:string,params={},config={}): Promise<ApiResponse<T>>{
    return instance.get(url,{params,...config})
}
export function Post<T = any>(url:string,data={},config={}): Promise<ApiResponse<T>>{
    return instance.post(url,data,config)
}
export function Put<T = any>(url:string,data={},config={}): Promise<ApiResponse<T>>{
    return instance.put(url,data,config)
}
export function Delete<T = any>(url:string,config={}): Promise<ApiResponse<T>>{
    return instance.delete(url,config)
}
const api={
    Get,
    Post,
    Put,
    Delete
}

export default api