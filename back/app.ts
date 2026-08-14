//import
import express from "express";
import cors from "cors";
import authRoutes from './routes/auth'
import articlesRoutes from './routes/articles'
import userRoutes from './routes/user'
import rssRoutes from './routes/rss'
import articlesmanagerRoutes from './routes/articlesmanagerRoutes'
import uploadRoutes from './routes/upload'
import { authMiddleware , responseWrapper } from './middleware'
import { Cserver, CallowedOrigins } from './config/index'
import { authLimiter, publicLimiter, globalLimiter } from './middleware/rateLimit'


//init
const app = express();
const PORT = Cserver.port

//middleware
app.use(cors({
  origin: CallowedOrigins.length ? CallowedOrigins : '*',
  credentials: CallowedOrigins.length ? true : false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseWrapper);
app.use(authMiddleware)

// 静态文件
app.use('/api/avatars', express.static('public/avatars'))
// 限流
app.use('/api', globalLimiter)
// 查看文章
app.use('/api/articles', publicLimiter ,articlesRoutes)
// 管理员登录
app.use('/admin/auth', authLimiter, authRoutes)
 // 管理员操作文章
app.use('/admin/articles', articlesmanagerRoutes)
 // 管理员信息
app.use('/admin/user', userRoutes)
// 图片上传（需登录，POST 时校验 token）
app.use('/admin/upload', uploadRoutes)
// RSS 订阅源（公开）
app.use('/api/rss', rssRoutes)



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
