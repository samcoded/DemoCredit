import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();
const jwtSecret: Secret = process.env.JWT_SECRET as string;

export const genToken = (data: object) => {
    return jwt.sign(data, jwtSecret, {
        expiresIn: '2 days',
    }); //generate jwt token
};

export const decryptToken = (data: object) => {};
