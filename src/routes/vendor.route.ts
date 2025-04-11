import { Router } from "express";
import { vendorLogin, vendorProfile } from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

router.post('/vendorLogin', vendorLogin)
router.use(Authenticate)
router.get('/profile', vendorProfile)
// router.post('/createVendor', CreateVendor)
// router.get('/getVendorById/:id', GetVendorById)

export default router;