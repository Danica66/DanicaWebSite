import jwt from 'jsonwebtoken'
import { Cjwt } from '../config/index'
  

export const generateToken = (userId: number) => {
  // Cjwt.expiresIn 来自 process.env（string），需断言为 SignOptions 的 StringValue 字面量类型
  return jwt.sign({ userId }, Cjwt.secret, { expiresIn: Cjwt.expiresIn as jwt.SignOptions['expiresIn'] })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, Cjwt.refreshSecret, { expiresIn: Cjwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, Cjwt.secret)
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, Cjwt.refreshSecret)
  } catch {
    return null
  }
}

export default { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken }