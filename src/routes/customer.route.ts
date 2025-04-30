import { Router } from "express";
import { customerLogin, customerSignup, customerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from "../controllers";
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

export default router;