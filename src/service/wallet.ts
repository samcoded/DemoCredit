import db from '../db/database';
import Wallet from '../interface/wallet';
import Payload from '../interface/service';
class WalletService {
    async create(wallet: Wallet): Promise<Payload> {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);

            if (!findWallet[0])
                await db('wallets').insert({
                    user_id: wallet.userId,
                    amount: wallet.amount,
                });

            return { success: true, message: 'Wallet created', data: {} };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async getWalletByUserId(wallet: Wallet): Promise<Payload> {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);
            const found = JSON.parse(JSON.stringify(findWallet));
            if (!found[0])
                return { success: false, message: 'No wallet found', data: {} };
            return {
                success: true,
                message: 'Wallet retrieved',
                data: found[0],
            };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async update(wallet: Wallet): Promise<Payload> {
        const { userId, amount } = wallet;

        try {
            const updateWallet = await db('wallets')
                .where('user_id', userId)
                .update({
                    amount,
                });

            return {
                success: true,
                message: 'Wallet updated',
                data: { user_id: userId, amount },
            };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }

    async delete(wallet: Wallet): Promise<Payload> {
        try {
            const findWallet = await db('wallets')
                .select('*')
                .where('user_id', wallet.userId);
            if (!findWallet[0])
                return { success: false, message: 'No wallet found', data: {} };
            const deleteWallet = await db('wallets')
                .where('user_id', wallet.userId)
                .delete();
            return {
                success: true,
                message: 'Wallet deleted successfully',
                data: {},
            };
        } catch (err) {
            return {
                success: false,
                message: (err as Error).message,
                data: {},
            };
        }
    }
}

export default new WalletService();
