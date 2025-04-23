import { Router } from "express";
import { addFood, getFood, updateVendor, updateVendorService, vendorLogin, vendorProfile } from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

router.post('/vendorLogin', vendorLogin)
router.use(Authenticate)
router.get('/profile', vendorProfile);
router.patch('/updateVendor', updateVendor);
router.patch('/updateVendorService', updateVendorService);

router.post('/addFood', addFood)
router.get('/getFood', getFood)


export default router;