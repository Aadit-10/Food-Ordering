import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../dto';
const jwt_secret = "OUR_APP_SECRET"

export const generateToken = (payload: AuthPayload) => {
    return jwt.sign(payload, jwt_secret, { expiresIn: '7d' });
};

export const validateToken = async (req: Request) => {
    const token = req.get('Authorization');

    if (token) {
        const payload = await jwt.verify(token.split(' ')[1], jwt_secret) as AuthPayload
        req.user = payload;
        return true;
    }
    return false
}