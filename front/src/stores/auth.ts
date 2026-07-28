import { authService } from "@/service/auth";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
const localstorageKey={
    accesstoken:'accesstoken',
    refreshtoken:'refreshtoken',
    user:'user'
}

export const useauthStore=defineStore('userLogin',()=>{
    const accesstoken=ref(localStorage.getItem(localstorageKey.accesstoken)||'')
    const refreshtoken=ref(localStorage.getItem(localstorageKey.refreshtoken)||'')
    const stored = localStorage.getItem(localstorageKey.user)
    const user = ref(stored ? JSON.parse(stored) : null)

    const isLogin=computed(()=>!!accesstoken.value)
    const userId=computed(()=>user.value?.id||'')
    const username=computed(()=>user.value?.name||'')

    const login=async(username:string,password:string)=>{
        const result=await authService.login(username,password)
        accesstoken.value=result.accesstoken
        refreshtoken.value=result.refreshtoken
        user.value=result.user
        localStorage.setItem(localstorageKey.accesstoken,result.accesstoken)
        localStorage.setItem(localstorageKey.refreshtoken,result.refreshtoken)
        localStorage.setItem(localstorageKey.user,JSON.stringify(result.user))

    }
    const register=async(username:string,password:string)=>{
        await authService.register(username,password)
    }
    const refresh=async()=>{
        const result=await authService.refresh(refreshtoken.value)
        accesstoken.value=result.accesstoken
        localStorage.setItem(localstorageKey.accesstoken,result.accesstoken)
    }
    const logout=async()=>{
        accesstoken.value=''
        refreshtoken.value=''
        user.value=null
        localStorage.removeItem(localstorageKey.accesstoken)
        localStorage.removeItem(localstorageKey.refreshtoken)
        localStorage.removeItem(localstorageKey.user)
    }

    return {
        // state
        accesstoken,
        refreshtoken,
        user,
        // getters
        isLogin,
        userId,
        username,
        // actions
        login,
        register,
        refresh,
        logout,
    };

})