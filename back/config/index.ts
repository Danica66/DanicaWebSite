import dotenv from 'dotenv'

// 加载 .env 文件
dotenv.config()

const config = {
  //server
  Cserver: {
    port: parseInt(process.env.PORT || '3000'),
  },

  // JWT
  Cjwt: {
    secret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.REFRESH_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
  },
  //mysql
  Cdatabase: {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    // 连接池配置
    pool: {
      max: 10,
    },
  },

  // 站点信息（RSS 等场景使用）
  Csite: {
    url: process.env.SITE_URL || '',
    title: process.env.SITE_TITLE || '',
    description: process.env.SITE_DESCRIPTION || '',
  },
  Credis:{
    password: process.env.REDIS_PASSWORD || '',
  },

  // CORS
  CallowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),
}

// 导出常用配置（方便使用）
export const { Cserver, Cjwt, Cdatabase, Csite, Credis, CallowedOrigins } = config
