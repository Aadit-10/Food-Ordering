import { Router } from "express";
import {
    createOrder, customerLogin, customerSignup, customerVerify,
    DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile,
    GetOrder, GetOrderById, RequestOtp, UpdateCart
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

router.post('/addToCart', UpdateCart);
router.get('/getFromCart', GetCart);
router.delete('/deleteFromCart', DeleteCart);


// Payment

// Order

router.post('/create-order', createOrder);
router.get('/orders', GetOrder);
router.get('/order/:id', GetOrderById);

export default router;