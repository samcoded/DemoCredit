import { Router } from 'express';
import { UserController } from '../controller/user';
import { WalletController } from '../controller/wallet';

const router = Router();

const userController = new UserController();
const walletController = new WalletController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', userController.read);
router
    .get('/users/:id', userController.readById)
    .put('/users/:id', userController.update)
    .delete('/users/:id', userController.delete);

router.put('/wallet/fund/:id', walletController.fund);
router.put('/wallet/transfer/:id', walletController.transfer);
router.put('/wallet/withdraw/:id', walletController.withdraw);

export default router;
