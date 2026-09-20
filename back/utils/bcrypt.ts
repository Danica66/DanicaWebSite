import bcrypt from 'bcryptjs'

export const compare = (password: string, hash: string)=> bcrypt.compare(password, hash)

export default { compare }
