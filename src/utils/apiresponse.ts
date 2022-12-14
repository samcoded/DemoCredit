import { Response } from 'express';

export const errorResponse = (
    res: Response,
    status: number,
    message: string,
    data: any
) => {
    return res.status(status).json({ success: false, status, message, data });
};

export const successResponse = (
    res: Response,
    status: number,
    message: string,
    data: any
) => {
    return res.status(status).json({ success: true, status, message, data });
};
