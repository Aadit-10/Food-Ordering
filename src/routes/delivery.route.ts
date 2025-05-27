import { Router } from "express";
import {
    DeliveryUserLogin, DeliveryUserSignup, EditCustomerProfile,
    GetCustomerProfile, UpdateDeliveryUserStatus,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

/**---------------- SignUp/ Create Customer ---------------- **/

router.post('/signup', DeliveryUserSignup);

/**---------------- Login ---------------- **/

router.post('/login', DeliveryUserLogin);


// Authenticate
router.use(Authenticate)

/**---------------- Change Service Status ---------------- **/

router.put('/change-status', UpdateDeliveryUserStatus);

/**---------------- Profile ---------------- **/

router.get('/profile', GetCustomerProfile);
router.patch('/editProfile', EditCustomerProfile);


export default router;