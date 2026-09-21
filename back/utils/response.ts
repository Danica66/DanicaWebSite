export const success = (data: any, message?: string) => {
  return { code: 200, data, message}
}

export const error = (message: string, code: number) => {
  return { code, message, data: null }
}

export const errors = {
  notFound: (msg: string) => error(`资源不存在: ${msg}`, 404),
  unauthorized: (msg: string) => error(`未授权: ${msg}`, 401),
}
