import { Router } from "express";
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorById, GetVendors, VerifyDeliveryUser } from "../controllers";

const router = Router();

router.post('/createVendor', CreateVendor)
router.get('/getVendors', GetVendors)
router.get('/getVendorById/:id', GetVendorById)
router.get('/getTransactions', GetTransactions);
router.get('/getTransactionById/:id', GetTransactionById);
router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/getDeliveryUsers', GetDeliveryUsers);

export default router;