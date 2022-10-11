import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import { errorResponse } from '../utils/apiresponse';

export const validate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg, {});
    }
    next();
};
