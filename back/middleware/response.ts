import { Request, Response, NextFunction } from 'express'
import { success, error,errors } from '../utils'

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
  // res.success(data, message) -> 自动包装成统一格式
  res.success = function (data: any, message?: string) {
    return this.status(200).json(success(data, message))
  }

  // res.error(message, code, status) -> 自动包装错误格式
  res.error = function (message: string, code = 1, status = 400) {
    return this.status(status).json(error(message, code))
  }

  // res.notFound(message) -> 404 快捷方式
  res.notFound = function (message: string) {
    return this.status(404).json(errors.notFound(message))
  }

  // res.unauthorized(message) -> 401 快捷方式
  res.unauthorized = function (message: string) {
    return this.status(401).json(errors.unauthorized(message))
  }

  // res.internalError(message) -> 500 快捷方式
  res.internalError = function (message: string) {
    return this.status(500).json(errors.internal(message))
  }
  //res.badRequest(message)-> 400 快捷方式
  res.badRequest=function(message:string){
    return this.status(400).json(errors.badRequest(message))
  }
  //res.forbidden(message)-> 403 快捷方式
  res.forbidden=function(message:string){
    return this.status(403).json(errors.forbidden(message))
  }

  next()
}