import jwt from 'jsonwebtoken'
import { Cjwt } from '../config/index'
  

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, Cjwt.secret, { expiresIn: Cjwt.expiresIn })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, Cjwt.refreshSecret, { expiresIn: Cjwt.refreshExpiresIn })
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