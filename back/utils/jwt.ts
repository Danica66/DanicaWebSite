import jwt from 'jsonwebtoken'
import { Cjwt } from '../config/index'
const SECRET = Cjwt.secret
const REFRESH_SECRET = Cjwt.refreshSecret
const AccessEXPIRES_IN = Cjwt.expiresIn
const RefreshEXPIRES_IN = Cjwt.refreshExpiresIn
  

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: AccessEXPIRES_IN })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: RefreshEXPIRES_IN })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET)
  } catch {
    return null
  }
}

export default { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken }