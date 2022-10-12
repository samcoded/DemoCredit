import db from '../db/database';
import User from '../interface/user';
import Payload from '../interface/service';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { genToken } from '../utils/jwtoken';
import dotenv from 'dotenv';

dotenv.config();

import walletService from '../service/wallet';

class UserService {
    async create(user: User): Promise<Payload> {
        try {
            const findUser = await db('users')
                .select('*')
                .where('email', user.email);

            if (findUser[0])
                return {
                    success: false,
                    message: 'Account already exists',
                    data: {},
                };

            user.password = await hashPassword(user.password);
            const create = await db('users').insert(user);
            const id = create[0];

            const token = genToken({ id: id?.toString(), name: user.name }); //generate jwt token
            return {
                success: true,
                message: 'User created',
                data: { id, name: user.name, email: user.email, token },
            };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async checkLogin(user: User): Promise<Payload> {
        const { email, password } = user;

        const findUser = await db('users').select('*').where('email', email);
        if (!findUser[0])
            return { success: false, message: 'Login failed', data: {} };

        const isMatch = comparePassword(password, findUser[0].password);
        if (!isMatch)
            return { success: false, message: 'Login failed', data: {} };
        const token = genToken({
            id: findUser[0].id?.toString(),
            name: findUser[0].name,
        });

        return {
            success: true,
            message: 'Login success',
            data: {
                id: findUser[0].id,
                name: findUser[0].name,
                email: findUser[0].email,
                token,
            },
        };
    }

    async readAll(): Promise<Payload> {
        try {
            const users = await db('users')
                .join('wallets', 'wallets.user_id', 'users.id')
                .select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'wallets.amount'
                );
            return { success: true, message: 'Users Retrieved', data: users };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async readById(id: string): Promise<Payload> {
        try {
            const user = await db('users')
                .join('wallets', 'wallets.user_id', 'users.id')
                .select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'wallets.amount'
                )
                .where('users.id', id);
            if (!user[0])
                return { success: false, message: 'No user found', data: {} };
            return { success: true, message: 'User Retrieved', data: user[0] };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async readByEmail(email: string): Promise<Payload> {
        try {
            const user = await db('users')
                .join('wallets', 'wallets.user_id', 'users.id')
                .select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'wallets.amount'
                )
                .where('users.email', email);
            if (!user[0])
                return { success: false, message: 'No user found', data: {} };
            return { success: true, message: 'User retrieved', data: user[0] };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async update(user: User): Promise<Payload> {
        const { id } = user;
        const { name, email, password } = user;

        try {
            const updateUser = await db('users').where('id', id).update({
                name,
                email,
                password,
            });

            return {
                success: true,
                message: 'User update',
                data: { name, email },
            };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async delete(id: string): Promise<Payload> {
        try {
            const user = await db('users').select('*').where('id', id);
            if (!user[0])
                return { success: false, message: 'No user found', data: {} };
            await walletService.delete({ userId: id }); //delete wallet
            await db('users').where('id', id).delete();
            return { success: true, message: 'User deleted', data: {} };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }
}

export default new UserService();
