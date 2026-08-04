import dotenv from 'dotenv'

// 加载 .env 文件
dotenv.config()

export const config = {
  //server
  Cserver: {
    port: parseInt(process.env.PORT || ''),
    env: process.env.NODE_ENV || '',
  },

  // JWT
  Cjwt: {
    secret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.REFRESH_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
  },
  //bcrypt
  Cbcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || ''),
  },

  //mysql
  Cdatabase: {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || ''),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    // 连接池配置
    pool: {
      min: 2,
      max: 10,
    },
  },

  // 站点信息（RSS 等场景使用）
  Csite: {
    url: process.env.SITE_URL || '',
    title: process.env.SITE_TITLE || '',
    description: process.env.SITE_DESCRIPTION || '',
  },

  // CORS
  CallowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),

  // Resend 邮件
  Cmail: {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.MAIL_FROM || '',
    codeExpiresIn: parseInt(process.env.MAIL_CODE_EXPIRES_IN || '300'), // 秒
    resendInterval: parseInt(process.env.MAIL_RESEND_INTERVAL || '60'), // 秒
  },
}

// 导出常用配置（方便使用）
export const { Cserver, Cjwt, Cdatabase, Cbcrypt, Csite, CallowedOrigins, Cmail } = config
