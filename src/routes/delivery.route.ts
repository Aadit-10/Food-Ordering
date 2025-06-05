import { Router } from "express";
import {
    DeliveryUserLogin, DeliveryUserSignup,
    EditDeliveryUserProfile,
    GetDeliveryUserProfile, UpdateDeliveryUserStatus,
} from "../controllers";
import { Authenticate, rules, validate } from "../middlewares";

const router = Router();

/**---------------- SignUp/ Create Customer ---------------- **/

router.post('/signup', validate(rules.deliverySignup), DeliveryUserSignup);

/**---------------- Login ---------------- **/

router.post('/login', validate(rules.login), DeliveryUserLogin);


// Authenticate
router.use(Authenticate)

/**---------------- Change Service Status ---------------- **/

router.put('/change-status', validate(rules.updateDeliveryUserStatus), UpdateDeliveryUserStatus);

/**---------------- Profile ---------------- **/

router.get('/profile', GetDeliveryUserProfile);
router.patch('/editProfile', validate(rules.editDeliveryUserProfile), EditDeliveryUserProfile);

export default router;