import { Request, Response } from 'express'

export const uploadAvatarController = (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined
  if (!file) {
    return res.error('请选择文件')
  }
  const url = '/api/avatars/' + file.filename
  return res.success({ url }, '上传成功')
}
