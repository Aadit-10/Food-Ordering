import { Router } from "express";
import { CreateVendor, GetTransactionById, GetTransactions, GetVendorById, GetVendors } from "../controllers";

const router = Router();

router.post('/createVendor', CreateVendor)
router.get('/getVendors', GetVendors)
router.get('/getVendorById/:id', GetVendorById)
router.get('/getTransactions', GetTransactions);
router.get('/getTransactionById/:id', GetTransactionById);

export default router;