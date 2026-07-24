import bcrypt from 'bcryptjs'
import { Cbcrypt } from '../config/index'


export const hash = (password: string)=>{
    return bcrypt.hashSync(password, Cbcrypt.saltRounds)
}
export const compare = (password: string, hash: string)=>{
    return bcrypt.compareSync(password, hash)
}

export default {hash, compare}