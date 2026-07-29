import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request, Response } from 'express'

const storage = multer.diskStorage({
  destination: 'public/avatars',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = crypto.randomBytes(12).toString('hex')
    cb(null, name + ext)
  },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('仅支持 PNG / JPEG / GIF / WebP 格式'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

export const uploadMiddleware = (req: Request, res: Response, next: any) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.badRequest('文件大小不能超过 2 MB')
      }
      return res.badRequest(err.message)
    }
    next()
  })
}
