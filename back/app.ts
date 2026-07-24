//import
import express from "express";
import cors from "cors";
import dotenv from 'dotenv'//把敏感信息（密码、密钥、API Key）放在 .env 文件里，而不是写在代码中
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import articlesRoutes from './routes/articles'
import { authMiddleware } from './middleware/auth'
import { Cserver } from './config/index'
import R from './utils/response'

//init
const app = express();
const PORT = Cserver.port;
dotenv.config()

//routes
app.use('/api/auth', authRoutes)           // 登录注册不需要鉴权
app.use('/api/chat', authMiddleware, chatRoutes)  // 聊天需要登录
app.use('/api/articles', articlesRoutes)   // 文章列表公开，增删改需要鉴权



//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//404
app.use((req, res) => {
    res.status(404).json(R.errors.notFound());
});
//error
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json(R.errors.internal());
})


//run server
app.listen(PORT, () => {
    console.log(`Back server is running at http://localhost:${PORT}`);
});