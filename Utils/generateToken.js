import jwt from 'jsonwebtoken'

export const generateToken = (payload)=>{
    const token = jwt.sign(payload, process.env.secret, {expiresIn: "1d"})
    return token
}
