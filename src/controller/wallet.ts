import { Request, Response } from 'express';
import walletService from '../service/wallet';
import userService from '../service/user';
import CustomResponse from '../interface/response';
import { errorResponse, successResponse } from '../utils/apiresponse';

class WalletController {
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
        const { id: senderID, logged_user_id: loggedUserId } = req.params;
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
        return successResponse(
            res,
            200,
            'Wallet withdrawal successful: #' + amount,
            updateWallet.data
        );
    }
}

export default new WalletController();
