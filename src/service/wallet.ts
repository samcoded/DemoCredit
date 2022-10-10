import db from '../db/database';
import Wallet from '../interface/wallet';

class WalletService {
    async create(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);

            if (!findWallet[0]) await db('wallets').insert(wallet);

            return { success: true, data: {} };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async getWalletByUserId(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);
            if (!findWallet[0])
                return { success: false, message: 'No wallet found' };
            return { success: true, data: findWallet[0] };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async update(wallet: Wallet) {
        const { userId, amount } = wallet;

        try {
            const updateWallet = await db('wallets')
                .where('user_id', userId)
                .update({
                    amount,
                });

            return { success: true, data: { user_id: userId, amount } };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }

    async delete(wallet: Wallet) {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);
            if (!findWallet[0])
                return { success: false, message: 'No wallet found' };
            const deleteWallet = await db('wallets')
                .where('user_id', wallet.userId)
                .delete();
            return { success: true, data: {} };
        } catch (err) {
            return { success: false, message: (err as Error).message };
        }
    }
}

export default new WalletService();
