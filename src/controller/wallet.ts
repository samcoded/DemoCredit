import { Request, Response } from 'express';
import db from '../db/database';
import Wallet from '../interface/wallet';
import { WalletService } from '../service/wallet';
import { UserService } from '../service/user';

const walletService = new WalletService();
const userService = new UserService();

class WalletController {
    async fund(req: Request, res: Response) {
        const { id: user_id } = req.params;
        const { amount } = req.body;

        const wallet = await walletService.getWalletByUserId({ user_id });
        const newAmount = parseInt(wallet.data.amount) + parseInt(amount);
        const updateWallet = await walletService.update({
            user_id,
            amount: newAmount,
        });
        if (!updateWallet.success)
            return res
                .status(500)
                .json({ message: updateWallet.message, data: {} });
        return res.status(200).json({
            message: 'Wallet funded: ' + amount,
            data: updateWallet.data,
        });
    }

    async transfer(req: Request, res: Response) {
        const { id: sender_id } = req.params;
        const { receiver_id } = req.body;
        const { amount } = req.body;

        // confirm receiver
        const receiver = await userService.readById(receiver_id);
        if (!receiver.success)
            return res
                .status(400)
                .json({ message: 'Invalid receiver', data: {} });

        const wallet = await walletService.getWalletByUserId({
            user_id: sender_id,
        });

        if (wallet.data.amount < amount)
            return res
                .status(400)
                .json({ message: 'Insufficient balance', data: {} });
        const deductedAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const senderUpdateWallet = await walletService.update({
            user_id: sender_id,
            amount: deductedAmount,
        });
        if (!senderUpdateWallet.success)
            return res
                .status(500)
                .json({ message: senderUpdateWallet.message, data: {} });

        // SEND TO RECEIVER
        const receiverWallet = await walletService.getWalletByUserId({
            user_id: receiver_id,
        });
        const newAmount =
            parseInt(receiverWallet.data.amount) + parseInt(amount);
        const updateWallet = await walletService.update({
            user_id: receiver_id,
            amount: newAmount,
        });
        if (!updateWallet.success)
            return res
                .status(500)
                .json({ message: updateWallet.message, data: {} });
        return res.status(200).json({
            message:
                'Wallet transfer ' + amount + ' successfully to ' + receiver_id,
            data: senderUpdateWallet.data,
        });
    }
    async withdraw(req: Request, res: Response) {
        const { id: user_id } = req.params;
        const { amount } = req.body;

        const wallet = await walletService.getWalletByUserId({ user_id });
        if (wallet.data.amount < amount)
            return res
                .status(400)
                .json({ message: 'Insufficient balance', data: {} });
        const newAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const updateWallet = await walletService.update({
            user_id,
            amount: newAmount,
        });
        if (!updateWallet.success)
            return res
                .status(500)
                .json({ message: updateWallet.message, data: {} });
        return res.status(200).json({
            message: 'Wallet funded: ' + amount,
            data: updateWallet.data,
        });
    }
}

export { WalletController };
