import db from '../index'
import {Request, Response} from 'express'
import { User } from '../../type/index'
//login:select
export const login=(req: Request, res: Response)=>{
    const User: User = req.body
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?'
    db.query(sql, [User.username, User.password], (err, result) => {
        if (err) {
            
        }
}
//register:select,insert