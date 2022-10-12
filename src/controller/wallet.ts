import { Request, Response } from 'express';
import walletService from '../service/wallet';
import userService from '../service/user';
import CustomResponse from '../interface/response';
import { errorResponse, successResponse } from '../utils/apiresponse';

class WalletController {
    async readById(req: Request, res: Response<CustomResponse>) {
        const { id: userId, logged_user_id: loggedUserId } = req.params;
        try {
            // check logged_user_id equal sender id
            if (loggedUserId != userId)
                return errorResponse(res, 400, 'Invalid Authorization', {});
            const read = await walletService.getWalletByUserId({ userId });
            if (!read.success)
                return errorResponse(res, 500, read.message, read.data);
            return successResponse(res, 200, read.message, read.data);
        } catch (err) {
            return errorResponse(res, 500, (err as Error).message, {});
        }
    }

    async fund(req: Request, res: Response<CustomResponse>) {
        const { id: userId, logged_user_id: loggedUserId } = req.params;
        const { amount } = req.body;
        try {
            // check logged_user_id equal sender id
            if (loggedUserId != userId)
                return errorResponse(res, 400, 'Invalid Authorization', {});

            const wallet = await walletService.getWalletByUserId({ userId });

            const oldAmount = wallet.data.amount;
            const newAmount = parseInt(oldAmount) + parseInt(amount);

            const updateWallet = await walletService.update({
                userId,
                amount: newAmount,
            });
            if (!updateWallet.success)
                return errorResponse(res, 500, updateWallet.message, {});

            // add transation
            const transaction = await walletService.addTransaction({
                userId,
                amount,
                type: 'credit',
                description: 'Wallet funding',
            });
            return successResponse(
                res,
                200,
                'Wallet funded: ' + amount,
                updateWallet.data
            );
        } catch (err) {
            return errorResponse(res, 500, (err as Error).message, {});
        }
    }

    async transfer(req: Request, res: Response<CustomResponse>) {
        const {
            id: senderID,
            logged_user_id: loggedUserId,
            logged_email: loggedEmail,
        } = req.params;
        const { to, amount } = req.body;

        // check logged_user_id equal sender id
        if (loggedUserId != senderID)
            return errorResponse(res, 400, 'Invalid Authorization', {});
        // confirm receiver
        const receiver = await userService.readByEmail(to);
        if (!receiver.success)
            return errorResponse(res, 400, 'Invalid Receiver email', {});

        // get sender wallet
        const wallet = await walletService.getWalletByUserId({
            userId: senderID,
        });

        if (wallet.data.amount < amount)
            return errorResponse(res, 400, 'Insufficient balance', {});
        const deductedAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const senderUpdateWallet = await walletService.update({
            userId: senderID,
            amount: deductedAmount,
        });
        if (!senderUpdateWallet.success)
            return errorResponse(res, 500, senderUpdateWallet.message, {});
        // add transaction
        const senderTransaction = await walletService.addTransaction({
            userId: senderID,
            amount,
            type: 'debit',
            description: 'Transfer to ' + to,
        });

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
            return errorResponse(res, 500, updateWallet.message, {});
        // add transaction
        const transaction = await walletService.addTransaction({
            userId: receiver.data.id,
            amount,
            type: 'credit',
            description: 'Transfer from ' + loggedEmail,
        });
        return successResponse(
            res,
            200,
            'Wallet transfer successful: #' +
                amount +
                ' sent to ' +
                receiver.data.email,
            senderUpdateWallet.data
        );
    }
    async withdraw(req: Request, res: Response<CustomResponse>) {
        const { id: userId, logged_user_id: loggedUserId } = req.params;
        const { amount } = req.body;

        // check logged_user_id equal sender id
        if (loggedUserId != userId)
            return errorResponse(res, 400, 'Invalid Authorization', {});

        const wallet = await walletService.getWalletByUserId({ userId });
        if (wallet.data.amount < amount)
            return errorResponse(res, 400, 'Insufficient balance', {});
        const newAmount = parseInt(wallet.data.amount) - parseInt(amount);
        const updateWallet = await walletService.update({
            userId,
            amount: newAmount,
        });
        if (!updateWallet.success)
            return errorResponse(res, 500, updateWallet.message, {});
        // add transaction
        const transaction = await walletService.addTransaction({
            userId,
            amount,
            type: 'debit',
            description: 'Withdrawal',
        });
        return successResponse(
            res,
            200,
            'Wallet withdrawal successful: #' + amount,
            updateWallet.data
        );
    }

    async readTransactionsByID(req: Request, res: Response<CustomResponse>) {
        const { id: userId, logged_user_id: loggedUserId } = req.params;
        try {
            // check logged_user_id equal sender id
            if (loggedUserId != userId)
                return errorResponse(res, 400, 'Invalid Authorization', {});
            const read = await walletService.getTransactionsByUserId({
                userId,
            });
            if (!read.success)
                return errorResponse(res, 500, read.message, read.data);
            return successResponse(res, 200, read.message, read.data);
        } catch (err) {
            return errorResponse(res, 500, (err as Error).message, {});
        }
    }
    async readTransactions(req: Request, res: Response<CustomResponse>) {
        try {
            const read = await walletService.getAllTransactions();
            if (!read.success)
                return errorResponse(res, 500, read.message, read.data);
            return successResponse(res, 200, read.message, read.data);
        } catch (err) {
            return errorResponse(res, 500, (err as Error).message, {});
        }
    }
}

export default new WalletController();
