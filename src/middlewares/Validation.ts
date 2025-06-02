import { NextFunction, Request, Response } from 'express';
import { body, check, ContextRunner, param, validationResult } from 'express-validator';
import { StatusCodes } from "http-status-codes";
import { sendResponse } from '../utils';


/**
 * Function to validate requests
 *
 * @param validations:ContextRunner[]
 * @returns
 */
export const validate = (validations: ContextRunner[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors: any = validationResult(req).array();
        if (errors.length != 0) {
            const error = errors[0];
            return sendResponse(res, StatusCodes.BAD_REQUEST, error.msg);
        }

        next();
    };
};

export const rules = {
    // Admin Route
    login: [
        body('email', 'Invalid Email Id.').exists().isEmail(),
        body('password', 'Password is required.').exists(),
    ],
    deliverySignup: [
        body('email', 'Invalid Email Id.').exists().isEmail(),
        body('phone', 'Phone Number is Required.').exists().trim().isLength({ min: 10, max: 10 }).withMessage('Contact number must be at least 10 characters long')
            .exists().notEmpty().isNumeric().withMessage('Contact number must be a number'),
        body('password', 'Password is required.').exists().notEmpty().withMessage('Password is required'),
        body('firstName', 'firstName is required.').exists().notEmpty().withMessage('firstName is required'),
        body('lastName', 'lastName is required.').exists().notEmpty().withMessage('lastName is required'),
        body('address', 'address is required.').exists().notEmpty().withMessage('address is required'),
        body('pincode', 'pincode is required.').exists().notEmpty().withMessage('pincode is required')
            .isNumeric().withMessage('Pincode must be a number'),
    ],
    customerSignup: [
        body('email', 'Invalid Email Id.').exists().isEmail(),
        body('phone', 'Phone Number is Required.').exists().trim().isLength({ min: 10, max: 10 }).withMessage('Contact number must be at least 10 characters long')
            .notEmpty().isNumeric().withMessage('Contact number must be a number'),
        body('password', 'Password is required.').exists(),
    ],
    createVendor: [
        body('name', 'Name is required.').exists().notEmpty().withMessage('Name is required'),
        body('ownerName', 'ownerName is required.').exists().notEmpty().withMessage('ownerName is required'),
        body('phone', 'phone is required.').exists().notEmpty().withMessage('phone is required'),
        body('address', 'address is required.').exists().notEmpty().withMessage('address is required'),
        body('email', 'email is required.').exists().notEmpty().withMessage('email is required').isEmail(),
        body('password', 'password is required.').exists().notEmpty().withMessage('password is required'),
        body('pincode', 'pincode is required.').exists().notEmpty().withMessage('pincode is required'),
        body('foodTypes', 'foodTypes is required.').isArray({ min: 1 }).withMessage('foodTypes must be a non-empty array')
            .exists().notEmpty().withMessage('foodTypes is required'),
    ],
    getVendorById: [
        param('id', 'Vendor ID is required').exists().withMessage('Vendor ID must exist in params')
            .notEmpty().withMessage('Vendor ID cannot be empty')
    ],
    getTransactionById: [
        param('id', 'Transaction ID is required').exists().withMessage('Transaction ID must exist in params')
            .notEmpty().withMessage('Transaction ID cannot be empty')
    ],
    verifyDeliveryUser: [
        body('id', 'Delivery User ID is required').exists().notEmpty().withMessage('Delivery User ID cannot be empty'),
        body('status', 'status is required.').exists().notEmpty().withMessage('status is required')
    ],

    // Customer Route
    customerVerify: [
        body('otp', 'Otp is Required.').exists().trim()
            .notEmpty().isNumeric().withMessage('Contact number must be a number'),
    ],
    editCustomerProfile: [
        body('firstName', 'firstName is required.').exists().notEmpty().withMessage('firstName is required'),
        body('lastName', 'lastName is required.').exists().notEmpty().withMessage('lastName is required'),
        body('address', 'address is required.').exists().notEmpty().withMessage('address is required'),
    ],
    updateCart: [
        body('_id', 'Food ID is required').notEmpty().withMessage('Food ID cannot be empty'),
        body('unit', 'unit is Required.').exists().notEmpty().isNumeric().withMessage('unit must be a number'),
    ],

    verifyOffer: [
        param('id', 'Offer ID is required').exists().withMessage('Offer ID must exist in params')
            .notEmpty().withMessage('Offer ID cannot be empty')
    ],

    createPayment: [
        body('otp', 'Otp is Required.').exists().trim().notEmpty()
            .isNumeric().withMessage('Contact number must be a number'),
        body('paymentMode', 'paymentMode is required').notEmpty().withMessage('paymentMode cannot be empty'),
        body('offerId', 'offerId is required').notEmpty().withMessage('offerId cannot be empty')
    ],
    createOrder: [
        body('txnId', 'txnId is Required.').exists().notEmpty(),
        body('amount', 'amount is required').notEmpty().withMessage('amount cannot be empty'),
        body('items', 'items is required').notEmpty().exists()
    ],


}