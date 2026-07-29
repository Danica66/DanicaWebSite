//import
import express from "express";
import cors from "cors";
import dotenv from 'dotenv'//把敏感信息（密码、密钥、API Key）放在 .env 文件里，而不是写在代码中
import authRoutes from './routes/auth'
import articlesRoutes from './routes/articles'
import userRoutes from './routes/user'
import rssRoutes from './routes/rss'
import uploadRoutes from './routes/upload'
import { authMiddleware , responseWrapper } from './middleware'
import { Cserver } from './config/index'
import { authLimiter, publicLimiter, globalLimiter } from './middleware/rateLimit'


//init
const app = express();
const PORT = Cserver.port

dotenv.config()

//middleware
app.use(cors());// 允许跨域请求
app.use(express.json());// 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));// 解析 URL 编码的请求体
app.use(responseWrapper);// 统一响应格式中间件
// 静态文件：上传的头像
app.use('/api/avatars', express.static('public/avatars'))
app.use(authMiddleware)//全局鉴权token

// 限流 + 路由（限流在路由之前）
app.use('/api', globalLimiter)              // 全局兜底: 15分钟200次
app.use('/api/auth', authLimiter, authRoutes)          // 登录/注册: 1分钟5次
// app.use('/api/chat', chatRoutes)  // 聊天需要登录
app.use('/api/articles', publicLimiter, articlesRoutes) // 公开文章: 15分钟100次
app.use('/api/user', userRoutes)                       // 用户信息（需登录）
app.use('/api/rss', rssRoutes)                         // RSS 订阅源（公开）
app.use('/api/upload', uploadRoutes)                   // 文件上传（需登录）



// 404
app.use((req, res) => {
  res.notFound('接口不存在')
})

//run server
app.listen(PORT, () => {
    console.log(`Back server is running at http://localhost:${PORT}`);
});