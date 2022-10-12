import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../db/database';
import { errorResponse } from '../utils/apiresponse';

import dotenv from 'dotenv';

dotenv.config();

const jwtSecret: Secret = process.env.JWT_SECRET as string;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';

        if (!token)
            return errorResponse(res, 401, 'Invalid Authentication', {});
        const decoded = jwt.verify(token as string, jwtSecret);
        const { id } = decoded as JwtPayload;

        const findUser = await db('users').select('*').where('id', id);
        if (!findUser[0])
            return errorResponse(res, 401, 'Invalid Authentication', {});
        req.params.logged_user_id = findUser[0].id;
        req.params.logged_user_name = findUser[0].name;
        req.params.logged_email = findUser[0].email;
    } catch (err) {
        return errorResponse(res, 401, (err as Error).message, {});
    }
    next();
};
