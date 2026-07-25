//import
import express from "express";
import cors from "cors";
import dotenv from 'dotenv'//把敏感信息（密码、密钥、API Key）放在 .env 文件里，而不是写在代码中
import authRoutes from './routes/auth'
// import chatRoutes from './routes/chat'
// import articlesRoutes from './routes/articles'
import { authMiddleware , responseWrapper } from './middleware'
import { Cserver } from './config/index'


//init
const app = express();
const PORT = Cserver.port;
dotenv.config()

//middleware
app.use(cors());// 允许跨域请求
app.use(express.json());// 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));// 解析 URL 编码的请求体
app.use(responseWrapper);// 统一响应格式中间件
app.use(authMiddleware)//全局鉴权token


//routes
app.use('/api/auth', authRoutes)           // 登录注册不需要鉴权
// app.use('/api/chat', chatRoutes)  // 聊天需要登录
// app.use('/api/articles', articlesRoutes)   // 文章列表公开，增删改需要鉴权



// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

//run server
app.listen(PORT, () => {
    console.log(`Back server is running at http://localhost:${PORT}`);
});