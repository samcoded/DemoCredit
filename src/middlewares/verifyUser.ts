import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

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
        const { id, name } = decoded as JwtPayload;
        req.params.logged_user_id = id;
        req.params.logged_user_name = name;
    } catch (err) {
        return res
            .status(401)
            .json({ message: 'Invalid Authentication', data: {} });
    }

    next();
};
