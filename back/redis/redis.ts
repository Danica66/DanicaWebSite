import Redis from 'ioredis'
import { Credis } from '../config'

// 直接导出 ioredis 实例：其方法已返回 Promise，无需再包一层转发
const client = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT as string) || 6379,
  password: Credis.password,
  enableOfflineQueue: false,
})

client.on('error', (err) => {
  console.error('Redis error:', err)
})

export default client
