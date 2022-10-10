import { Request, Response } from 'express';
import User from '../interface/user';
import userService from '../service/user';

class UserController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const user: User = {
            name,
            email,
            password,
        };

        const registerUser = await userService.create(user);
        if (!registerUser.success)
            return res
                .status(500)
                .json({ message: registerUser.message, data: {} });

        return res
            .status(200)
            .json({ message: 'User registered', data: registerUser.data });
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user: User = {
            email,
            password,
        };

        const login = await userService.checkLogin(user);
        if (!login.success)
            return res.status(500).json({ message: login.message, data: {} });
        return res
            .status(200)
            .json({ message: 'Login successful', data: login.data });
    }

    async readAll(req: Request, res: Response) {
        const read = await userService.readAll();
        if (!read.success)
            return res.status(500).json({ message: read.message, data: {} });
        return res
            .status(200)
            .json({ message: 'Users retrieved', data: read.data });
    }

    async readById(req: Request, res: Response) {
        const { id } = req.params;

        const read = await userService.readById(id);
        if (!read.success)
            return res.status(500).json({ message: read.message, data: {} });
        return res
            .status(200)
            .json({ message: 'User retrieved', data: read.data });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const update: User = {
            id,
            name,
            email,
            password,
        };

        const updateUser = await userService.update(update);
        if (!updateUser.success)
            return res
                .status(500)
                .json({ message: updateUser.message, data: {} });
        return res
            .status(200)
            .json({ message: 'User updated', data: updateUser.data });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const deleteUser = await userService.delete(id);
        if (!deleteUser.success)
            return res
                .status(500)
                .json({ message: deleteUser.message, data: {} });
        return res
            .status(200)
            .json({ message: 'User deleted', data: deleteUser.data });
    }
}

export default new UserController();
