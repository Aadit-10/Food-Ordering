import { Router } from "express";
import { customerSignup } from "../controllers";

const router = Router();

router.post('/signup', customerSignup);

// router.post('/login');




// router.patch('/verify');

// router.get('/otp');

// router.get('/profile');

// router.patch('/editProfile');

export default router;