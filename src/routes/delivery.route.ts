import { Router } from "express";
import {
    DeliveryUserLogin, DeliveryUserSignup, EditCustomerProfile,
    EditDeliveryUserProfile,
    GetCustomerProfile, GetDeliveryUserProfile, UpdateDeliveryUserStatus,
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

router.get('/profile', GetDeliveryUserProfile);
router.patch('/editProfile', EditDeliveryUserProfile);


export default router;