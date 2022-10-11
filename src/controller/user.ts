import { Request, Response } from 'express';
import User from '../interface/user';
import userService from '../service/user';
import CustomResponse from '../interface/response';
import { errorResponse, successResponse } from '../utils/apiresponse';
class UserController {
    async register(req: Request, res: Response<CustomResponse>) {
        const { name, email, password } = req.body;

        const user: User = {
            name,
            email,
            password,
        };

        const registerUser = await userService.create(user);
        if (!registerUser.success)
            return errorResponse(
                res,
                500,
                registerUser.message,
                registerUser.data
            );
        return successResponse(
            res,
            200,
            registerUser.message,
            registerUser.data
        );
    }

    async login(req: Request, res: Response<CustomResponse>) {
        const { email, password } = req.body;

        const user: User = {
            email,
            password,
        };

        const login = await userService.checkLogin(user);
        if (!login.success)
            return errorResponse(res, 500, login.message, login.data);
        return successResponse(res, 200, login.message, login.data);
    }

    async readAll(req: Request, res: Response<CustomResponse>) {
        const read = await userService.readAll();
        if (!read.success)
            return errorResponse(res, 500, read.message, read.data);
        return successResponse(res, 200, read.message, read.data);
    }

    async readById(req: Request, res: Response<CustomResponse>) {
        const { id } = req.params;

        const read = await userService.readById(id);
        if (!read.success)
            return errorResponse(res, 500, read.message, read.data);
        return successResponse(res, 200, read.message, read.data);
    }

    async update(req: Request, res: Response<CustomResponse>) {
        const { id, logged_user_id: loggedUserId } = req.params;
        const { name, email, password } = req.body;

        // check logged_user_id equal sender id
        if (loggedUserId != id)
            return errorResponse(res, 400, 'Invalid Authorization', {});

        const update: User = {
            id,
            name,
            email,
            password,
        };

        const updateUser = await userService.update(update);
        if (!updateUser.success)
            return errorResponse(res, 500, updateUser.message, updateUser.data);
        return successResponse(res, 200, updateUser.message, updateUser.data);
    }

    async delete(req: Request, res: Response<CustomResponse>) {
        const { id, logged_user_id: loggedUserId } = req.params;

        // check logged_user_id equal sender id
        if (loggedUserId != id)
            if (loggedUserId != id)
                return errorResponse(res, 400, 'Invalid Authorization', {});

        const deleteUser = await userService.delete(id);
        if (!deleteUser.success)
            return errorResponse(res, 500, deleteUser.message, deleteUser.data);
        return successResponse(res, 200, deleteUser.message, deleteUser.data);
    }
}

export default new UserController();
