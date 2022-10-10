import db from '../db/database';
import User from '../interface/user';
import bcrypt from 'bcrypt';

const saltRounds = 8;
import { WalletService } from '../service/wallet';

const walletService = new WalletService();

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
            await walletService.create({ user_id: id, amount: 0 }); //create wallet
            return {
                success: true,
                data: { id, name: user.name, email: user.email },
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

        return {
            success: true,
            data: {
                id: findUser[0].id,
                name: findUser[0].name,
                email: findUser[0].email,
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
            await walletService.delete({ user_id: id }); //delete wallet
            return { success: true, data: {} };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }
}

export { UserService };
