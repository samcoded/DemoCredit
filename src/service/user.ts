import db from '../db/database';
import User from '../interface/user';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const saltRounds = 8;
const jwtSecret: Secret = process.env.JWT_SECRET as string;
import walletService from '../service/wallet';

class UserService {
    async create(user: User) {
        try {
            const findUser = await db('users')
                .select('*')
                .where('email', user.email);

            if (findUser[0])
                return { success: false, message: 'Account already exists' };

            user.password = await bcrypt.hash(user.password, saltRounds);
            const create = await db('users').insert(user);
            const id = create[0];
            await walletService.create({ userId: id, amount: 0 }); //create wallet
            const token = jwt.sign(
                { id: findUser[0].id?.toString(), name: findUser[0].name },
                jwtSecret,
                {
                    expiresIn: '2 days',
                }
            ); //generate jwt token
            return {
                success: true,
                data: { id, name: user.name, email: user.email, token },
            };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async checkLogin(user: User) {
        const { email, password } = user;

        const findUser = await db('users').select('*').where('email', email);
        if (!findUser[0]) return { success: false, message: 'Login failed' };

        const isMatch = bcrypt.compareSync(password, findUser[0].password);
        if (!isMatch) return { success: false, message: 'Login failed' };
        const token = jwt.sign(
            { id: findUser[0].id?.toString(), name: findUser[0].name },
            jwtSecret,
            {
                expiresIn: '2 days',
            }
        );

        return {
            success: true,
            data: {
                id: findUser[0].id,
                name: findUser[0].name,
                email: findUser[0].email,
                token,
            },
        };
    }

    async readAll() {
        try {
            const users = await db('users')
                .join('wallets', 'wallets.user_id', 'users.id')
                .select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'wallets.amount'
                );
            return { success: true, data: users };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async readById(id: string) {
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
            if (!user[0]) return { success: false, message: 'No user found' };
            return { success: true, data: user[0] };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async readByEmail(email: string) {
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
            if (!user[0]) return { success: false, message: 'No user found' };
            return { success: true, data: user[0] };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async update(user: User) {
        const { id } = user;
        const { name, email, password } = user;

        try {
            const updateUser = await db('users').where('id', id).update({
                name,
                email,
                password,
            });

            return { success: true, data: { name, email } };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async delete(id: string) {
        try {
            const user = await db('users').select('*').where('id', id);
            if (!user[0]) return { success: false, message: 'No user found' };
            await db('users').where('id', id).delete();
            await walletService.delete({ userId: id }); //delete wallet
            return { success: true, data: {} };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }
}

export default new UserService();
