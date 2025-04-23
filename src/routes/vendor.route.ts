import { Router } from "express";
import { addFood, getFood, updateVendor, updateVendorCoverImage, updateVendorService, vendorLogin, vendorProfile } from "../controllers";
import { Authenticate } from "../middlewares";
import { upload } from "../middlewares";

const router = Router();

router.post('/vendorLogin', vendorLogin)
router.use(Authenticate)
router.get('/profile', vendorProfile);
router.patch('/updateVendor', updateVendor);
router.patch('/updateVendorService', updateVendorService);
router.patch('/updateVendorCoverImage', upload, updateVendorCoverImage);

router.post('/addFood', upload, addFood)
router.get('/getFood', getFood)


export default router;