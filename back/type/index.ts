declare global {
  namespace Express {
    //req加入user属性
    interface Request {
      user: UserPayload
    }
  }
}
//user接口(类型)
export interface UserPayload {
  userId: string
  username?: string
}
//login
export interface User {
  username: string
  password: string
}