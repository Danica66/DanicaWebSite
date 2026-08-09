import { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

// 上传目录：back/uploads/（gitignore；Docker 部署时用 volume 持久化）
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// 只允许常见的图片格式；svg 可内嵌脚本，一律拒绝
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // 用随机文件名，避免用户文件名中的路径穿越/中文乱码问题
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10)
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('仅支持 JPG/PNG/WebP/GIF 图片'))
    }
    cb(null, true)
  },
})

export const uploadImageController = (req: Request, res: Response) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? '图片不能超过 5MB' : err.message
      return res.error(msg, 1, 400)
    }
    if (!req.file) {
      return res.error('缺少图片文件（字段名: image）', 1, 400)
    }
    // 返回可直接写入 markdown 的 URL 路径
    res.success({ url: `/api/images/${req.file.filename}` }, '上传成功')
  })
}
