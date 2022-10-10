import knex, { Knex } from 'knex';
import db from '../db/database';
import Wallet from '../interface/wallet';

class WalletService {
    async create(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.user_id);

            if (!findWallet[0]) await db('wallets').insert(wallet);

            return { success: true, data: { wallet } };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async getWalletByUserId(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.user_id);
            if (!findWallet[0])
                return { success: false, message: 'No wallet found' };
            return { success: true, data: findWallet[0] };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async update(wallet: Wallet) {
        const { user_id, amount } = wallet;

        try {
            const updateWallet = await db('wallets')
                .where('user_id', user_id)
                .update({
                    amount,
                });

            return { success: true, data: { user_id, amount } };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async delete(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.user_id);
            if (!findWallet[0])
                return { success: false, message: 'No wallet found' };
            const deleteWallet = await db('wallets')
                .where('user_id', wallet.user_id)
                .delete();
            return { success: true, data: {} };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }
}

export { WalletService };
