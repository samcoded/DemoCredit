const { body, param } = require('express-validator');

class Validator {
    register() {
        //validate with express validator
        return [
            body('name').notEmpty().withMessage('Name is required'),
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is invalid'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
        ];
    }

    login() {
        //validate with express validator
        return [
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is invalid'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
        ];
    }
    paramId() {
        //validate with express validator

        return [param('id').notEmpty().withMessage('Params Id is required')];
    }
    update() {
        //validate with express validator
        return [
            param('id').notEmpty().withMessage('Params Id is required'),
            body('name')
                .optional()
                .isLength({ min: 2 })
                .withMessage('Name must be at least 2 characters'),
            body('email').optional().isEmail().withMessage('Email is invalid'),
        ];
    }
    fund() {
        //validate with express validator
        return [
            param('id').notEmpty().withMessage('Params Id is required'),
            body('amount')
                .notEmpty()
                .withMessage('Amount is required')
                .isNumeric()
                .withMessage('Amount must be numeric'),
        ];
    }
    transfer() {
        //validate with express validator
        return [
            param('id').notEmpty().withMessage('Params Id is required'),
            body('amount')
                .notEmpty()
                .withMessage('Amount is required')
                .isNumeric()
                .withMessage('Amount must be numeric'),
            body('to')
                .notEmpty()
                .withMessage('To is required')
                .isEmail()
                .withMessage('To is invalid'),
        ];
    }
    withdraw() {
        //validate with express validator
        return [
            param('id').notEmpty().withMessage('Params Id is required'),
            body('amount')
                .notEmpty()
                .withMessage('Amount is required')
                .isNumeric()
                .withMessage('Amount must be numeric'),
        ];
    }
}

export default new Validator();
