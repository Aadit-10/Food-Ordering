import { Router } from "express";
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorById, GetVendors, VerifyDeliveryUser } from "../controllers";
import { rules, validate } from "../middlewares";

const router = Router();

router.post('/createVendor', validate(rules.createVendor), CreateVendor)
router.get('/getVendors', GetVendors)
router.get('/getVendorById/:id', GetVendorById)
router.get('/getTransactions', GetTransactions);
router.get('/getTransactionById/:id', validate(rules.getTransactionById), GetTransactionById);
router.put('/delivery/verify', validate(rules.verifyDeliveryUser), VerifyDeliveryUser)
router.get('/getDeliveryUsers', GetDeliveryUsers);

export default router;