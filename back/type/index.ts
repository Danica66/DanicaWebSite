declare global {
  namespace Express {
    //req加入user属性
    interface Request {
      user: UserPayload
    }
    //res加入快捷方法
    interface Response {
      success: (data: any, message?: string) => Response//200
      error: (message: string, code?: number, status?: number) => Response
      notFound: (message: string) => Response//404
      unauthorized: (message: string) => Response//401
      internalError: (message: string) => Response//500
      forbidden: (message: string) => Response//403
      badRequest: (message: string) => Response//400
    }
  }
}
//user接口(类型)
export interface UserPayload {
  userId: string
}
//login
export interface UserLogin {
  username: string
  password: string
}
