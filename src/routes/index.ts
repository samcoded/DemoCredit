import { Router } from 'express';
import userController from '../controller/user';
import walletController from '../controller/wallet';
import { auth } from '../middlewares/verifyUser';
import { validate } from '../middlewares/validate';
import validator from '../utils/validator';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'DemoCredit API',
    });
});

// PUBLIC ROUTES
router.post(
    '/register',
    validator.register(),
    validate,
    userController.register
);
router.post('/login', validator.login(), validate, userController.login);

// PRIVATE ROUTES - NEEDS AUTHENTICATION (JWT)
router.get('/users', auth, userController.readAll);

router
    .get(
        '/users/:id',
        auth,
        validator.paramId(),
        validate,
        userController.readById
    )
    .put(
        '/users/:id',
        auth,
        validator.update(),
        validate,
        userController.update
    )
    .delete(
        '/users/:id',
        auth,
        validator.paramId(),
        validate,
        userController.delete
    );

router.put(
    '/wallet/fund/:id',
    auth,
    validator.fund(),
    validate,
    walletController.fund
);
router.put(
    '/wallet/transfer/:id',
    auth,
    validator.transfer(),
    validate,
    walletController.transfer
);
router.put(
    '/wallet/withdraw/:id',
    auth,
    validator.withdraw(),
    validate,
    walletController.withdraw
);

export default router;
