import jwt from '../utils/jwt'
import { Request, Response } from 'express'
import R from '../utils/response'
// 登录逻辑
export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const accesstoken = jwt.generateToken(username);
        const refreshtoken = jwt.generateRefreshToken(username);
        return res.json(R.success({ accesstoken, refreshtoken,username }, '登录成功'));
    }else{
        return res.status(401).json(R.error('用户名或密码错误', 401));
    } 
}

// 注册逻辑
export const register = (req: Request, res: Response) => {
    const { username, password } = req.body;
    
}