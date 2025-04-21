import { Router } from "express";
import { updateVendor, updateVendorService, vendorLogin, vendorProfile } from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

router.post('/vendorLogin', vendorLogin)
router.use(Authenticate)
router.get('/profile', vendorProfile)
router.post('/updateVendor', updateVendor)
router.post('/updateVendorService', updateVendorService)

export default router;