import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../db/database';

import dotenv from 'dotenv';

dotenv.config();

const jwtSecret: Secret = process.env.JWT_SECRET as string;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token)
            return res
                .status(401)
                .json({ message: 'Invalid Authentication', data: {} });

        const decoded = jwt.verify(token, jwtSecret);
        const { id } = decoded as JwtPayload;

        const findUser = await db('users').select('*').where('id', id);

        if (!findUser[0])
            return res
                .status(401)
                .json({ message: 'Invalid Authentication', data: {} });

        req.params.logged_user_id = findUser[0].id;
        req.params.logged_user_name = findUser[0].name;
    } catch (err) {
        return res
            .status(401)
            .json({ message: 'Invalid Authentication', data: {} });
    }
    next();
};