import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');

export const validate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: errors.array()[0].msg, data: {} });
    }
    next();
};
