export const success = (data: any, message?: string) => {
  return { code: 200, data, message}
}

export const error = (message: string, code: number) => {
  return { code, message, data: null }
}

export const errors = {
  notFound: (msg: string) => error(`资源不存在: ${msg}`, 404),
  unauthorized: (msg: string) => error(`未授权: ${msg}`, 401),
  forbidden: (msg: string) => error(`禁止访问: ${msg}`, 403),
  badRequest: (msg: string) => error(`请求参数错误: ${msg}`, 400),
  internal: (msg: string) => error(`服务器内部错误: ${msg}`, 500),
}



export default { success, error, errors }