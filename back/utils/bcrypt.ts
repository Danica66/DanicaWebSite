import bcrypt from 'bcryptjs'
import { Cbcrypt } from '../config/index'


export const hash = (password: string)=> bcrypt.hash(password, Cbcrypt.saltRounds)

export const compare = (password: string, hash: string)=> bcrypt.compare(password, hash)


export default {hash, compare}