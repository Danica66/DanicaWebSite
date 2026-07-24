import { Request, Response, NextFunction } from 'express'
import { success, error } from '../utils/response'

// 这个中间件给 res 对象挂上快捷方法
export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
  // res.success(data, message) -> 自动包装成统一格式
  res.success = function (data: any, message = 'success') {
    return this.status(200).json(success(data, message))
  }

  // res.error(message, code, status) -> 自动包装错误格式
  res.error = function (message: string, code = 1, status = 400) {
    return this.status(status).json(error(message, code))
  }

  // res.notFound(message) -> 404 快捷方式
  res.notFound = function (message = '资源不存在') {
    return this.status(404).json(error(message, 404))
  }

  // res.unauthorized(message) -> 401 快捷方式
  res.unauthorized = function (message = '未授权') {
    return this.status(401).json(error(message, 401))
  }

  // res.internalError(message) -> 500 快捷方式
  res.internalError = function (message = '服务器错误') {
    return this.status(500).json(error(message, 500))
  }

  next()
}