import { Router } from "express";
import {
    createOrder, CreatePayment, customerLogin, customerSignup, customerVerify,
    DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile,
    GetOrder, GetOrderById, RequestOtp, UpdateCart,
    VerifyOffer
} from "../controllers";
import { Authenticate, rules, validate } from "../middlewares";

const router = Router();

router.post('/signup', validate(rules.customerSignup), customerSignup);

router.post('/login', validate(rules.login), customerLogin);


// Authenticate
router.use(Authenticate)

router.patch('/verify', validate(rules.customerVerify), customerVerify);
router.get('/otp', RequestOtp);
router.get('/profile', GetCustomerProfile);
router.patch('/editProfile', validate(rules.editCustomerProfile), EditCustomerProfile);

// Cart
router.post('/updateCart', validate(rules.updateCart), UpdateCart);
router.get('/getFromCart', GetCart);
router.delete('/deleteCart', DeleteCart);

// Apply Offers
router.get('/offer/verify/:id', validate(rules.verifyOffer), VerifyOffer);

// Payment
router.post('/create-payment', validate(rules.createPayment), CreatePayment);

// Order
router.post('/create-order', validate(rules.createOrder), createOrder);
router.get('/orders', GetOrder);
router.get('/order/:id', GetOrderById);

export default router;