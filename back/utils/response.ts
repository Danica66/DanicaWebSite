export const success = (data: any, message = 'success') => {
  return { code: 200, data, message }
}

export const error = (message: string, code: number) => {
  return { code, message, data: null }
}

export const errors = {
  notFound: (msg = '资源不存在') => error(msg, 404),
  unauthorized: (msg = '未授权') => error(msg, 401),
  forbidden: (msg = '禁止访问') => error(msg, 403),
  badRequest: (msg = '请求参数错误') => error(msg, 400),
  internal: (msg = '服务器内部错误') => error(msg, 500),
}



export default { success, error, errors }