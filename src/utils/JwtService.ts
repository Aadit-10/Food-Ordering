import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../dto';
const jwt_secret = "OUR_APP_SECRET"

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, jwt_secret as string, {
        expiresIn: '7d'
    });
};

export const validateToken = async (req: Request) => {
    const token = req.get('Authorization');

    if (token) {
        const payload = await jwt.verify(token.split(' ')[1], jwt_secret) as AuthPayload
        console.log("payload", payload);
        req.user = payload;
        return true;
    }
    console.log("hai from jwtservcie");
    return false
}