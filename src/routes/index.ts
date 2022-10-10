import { Router } from 'express';
import { UserController } from '../controller/user';
import { WalletController } from '../controller/wallet';
import { auth } from '../middlewares/verifyUser';

const router = Router();

const userController = new UserController();
const walletController = new WalletController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', auth, userController.read);
router
    .get('/users/:id', auth, userController.readById)
    .put('/users/:id', auth, userController.update)
    .delete('/users/:id', auth, userController.delete);

router.put('/wallet/fund/:id', auth, walletController.fund);
router.put('/wallet/transfer/:id', auth, walletController.transfer);
router.put('/wallet/withdraw/:id', auth, walletController.withdraw);

export default router;
