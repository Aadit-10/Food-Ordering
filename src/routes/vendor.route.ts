import { Router } from "express";
import { addFood, AddOffer, EditOffer, getCurrentOrders, getFood, GetOffers, getOrderDetails, ProcessOrder, updateVendor, updateVendorCoverImage, updateVendorService, vendorLogin, vendorProfile } from "../controllers";
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

// Orders 

router.get('/orders', getCurrentOrders);
router.get('/order/:id', getOrderDetails);
router.put('/order/:id/process', ProcessOrder);

// Offers
router.get('/offers', GetOffers);
router.post('/addOffer', AddOffer);
router.put('/editOffer/:id', EditOffer);

export default router;