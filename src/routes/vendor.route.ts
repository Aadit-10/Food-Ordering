import { Router } from "express";
import { CreateVendor, GetVendors, GetVendorById, vendorLogin } from "../controllers";

const router = Router();

router.post('/vendorLogin', vendorLogin)
// router.post('/createVendor', CreateVendor)
// router.get('/getVendors', GetVendors)
// router.get('/getVendorById/:id', GetVendorById)

export default router;