//import
import express from "express";
import cors from "cors";
import authRoutes from './routes/auth'
import articlesRoutes from './routes/articles'
import userRoutes from './routes/user'
import rssRoutes from './routes/rss'
import uploadRoutes from './routes/upload'
import commentRoutes from './routes/comment'
import { authMiddleware , responseWrapper } from './middleware'
import { Cserver, CallowedOrigins } from './config/index'
import { authLimiter, publicLimiter, globalLimiter } from './middleware/rateLimit'


//init
const app = express();
const PORT = Cserver.port

//middleware
app.use(cors({
  origin: CallowedOrigins || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseWrapper);
app.use(authMiddleware)

// 静态文件
app.use('/api/avatars', express.static('public/avatars'))
// 限流
app.use('/api', globalLimiter)
// 登录/注册: 1分钟5次
app.use('/api/auth', authLimiter, authRoutes)
 // 公开文章: 15分钟100次
app.use('/api/articles', publicLimiter, articlesRoutes)
 // 用户信息（需登录）
app.use('/api/user', userRoutes)
// RSS 订阅源（公开）
app.use('/api/rss', rssRoutes)
// 文件上传（需登录）
app.use('/api/upload', uploadRoutes)
app.use('/api', commentRoutes)


// 404
app.use((req, res) => {
  res.notFound('接口不存在')
})

//run server
app.listen(PORT, () => {
    console.log(`
  ____              _
 |  _ \\  __ _ _ __ (_) ___ __ _
 | | | |/ _\` | '_ \\| |/ __/ _\` |
 | |_| | (_| | | | | | (_| (_| |
 |____/ \\__,_|_| |_|_|\\___\\__,_|

    `)
})
