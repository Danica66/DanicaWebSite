import dotenv from 'dotenv'


// 加载 .env 文件
dotenv.config()

export const config = {
  //server
  Cserver: {
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'development',
  },

  // JWT 
  Cjwt: {
    secret: process.env.JWT_SECRET || 'danicasecretkey',
    refreshSecret: process.env.REFRESH_SECRET || 'danicarefreshsecretkey',
    expiresIn: '1d' as const,
    refreshExpiresIn: '7d' as const,
  },

  //mysql
  Cdatabase: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'my_website',
    // 连接池配置
    pool: {
      min: 2,
      max: 10,
    },
  },
}

// 导出常用配置（方便使用）
export const { Cserver, Cjwt, Cdatabase } = config