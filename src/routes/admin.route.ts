import { Router } from "express";
import { CreateVendor, GetVendorById, GetVendors } from "../controllers";

const router = Router();

router.post('/createVendor', CreateVendor)
router.get('/getVendors', GetVendors)
router.get('/getVendorById/:id', GetVendorById)

export default router;