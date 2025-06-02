import { Router } from "express";
import {
    createOrder, CreatePayment, customerLogin, customerSignup, customerVerify,
    DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile,
    GetOrder, GetOrderById, RequestOtp, UpdateCart,
    VerifyOffer
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

router.post('/signup', customerSignup);

router.post('/login', customerLogin);


// Authenticate
router.use(Authenticate)

router.patch('/verify', customerVerify);
router.get('/otp', RequestOtp);
router.get('/profile', GetCustomerProfile);
router.patch('/editProfile', EditCustomerProfile);

// Cart

router.post('/updateCart', UpdateCart);
router.get('/getFromCart', GetCart);
router.delete('/deleteCart', DeleteCart);

// Apply Offers
router.get('/offer/verify/:id', VerifyOffer);

// Payment
router.post('/create-payment', CreatePayment);

// Order

router.post('/create-order', createOrder);
router.get('/orders', GetOrder);
router.get('/order/:id', GetOrderById);

export default router;