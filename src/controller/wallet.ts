import { Request, Response } from 'express';
import walletService from '../service/wallet';
import userService from '../service/user';

class WalletController {
    async fund(req: Request, res: Response) {
        const { id: userId } = req.params;
        const { amount } = req.body;

        const wallet = await walletService.getWalletByUserId({ userId });
        const newAmount = parseInt(wallet.data.amount) + parseInt(amount);
        const updateWallet = await walletService.update({
            userId,
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
        const { id: senderID, logged_user_id: loggedUserId } = req.params;
        const { to, amount } = req.body;

        // check logged_user_id equal sender id
        if (loggedUserId != senderID)
            return res
                .status(400)
                .json({ message: 'Invalid Authorization', data: {} });

        // confirm receiver
        const receiver = await userService.readByEmail(to);
        if (!receiver.success)
            return res
                .status(400)
                .json({ message: 'Invalid receiver email', data: {} });

        // get sender wallet
        const wallet = await walletService.getWalletByUserId({
            userId: senderID,
        });

        if (wallet.data.amount < amount)
            return res
                .status(400)
                .json({ message: 'Insufficient balance', data: {} });
        const deductedAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const senderUpdateWallet = await walletService.update({
            userId: senderID,
            amount: deductedAmount,
        });
        if (!senderUpdateWallet.success)
            return res
                .status(500)
                .json({ message: senderUpdateWallet.message, data: {} });

        // SEND TO RECEIVER
        const receiverWallet = await walletService.getWalletByUserId({
            userId: receiver.data.id,
        });
        const newAmount =
            parseInt(receiverWallet.data.amount) + parseInt(amount);
        const updateWallet = await walletService.update({
            userId: receiver.data.id,
            amount: newAmount,
        });
        if (!updateWallet.success)
            return res
                .status(500)
                .json({ message: updateWallet.message, data: {} });
        return res.status(200).json({
            message:
                'Wallet transfer successful: #' +
                amount +
                ' sent to ' +
                receiver.data.email,
            data: senderUpdateWallet.data,
        });
    }
    async withdraw(req: Request, res: Response) {
        const { id: userId, logged_user_id: loggedUserId } = req.params;
        const { amount } = req.body;

        // check logged_user_id equal sender id
        if (loggedUserId != userId)
            return res
                .status(400)
                .json({ message: 'Invalid Authorization', data: {} });

        const wallet = await walletService.getWalletByUserId({ userId });
        if (wallet.data.amount < amount)
            return res
                .status(400)
                .json({ message: 'Insufficient balance', data: {} });
        const newAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const updateWallet = await walletService.update({
            userId,
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

export default new WalletController();
