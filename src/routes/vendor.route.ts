import { Router } from "express";
import { addFood, AddOffer, EditOffer, getCurrentOrders, getFood, GetOffers, getOrderDetails, ProcessOrder, updateVendor, updateVendorCoverImage, updateVendorService, vendorLogin, vendorProfile } from "../controllers";
import { Authenticate, requireImages, rules, validate } from "../middlewares";
import { upload } from "../middlewares";

const router = Router();

router.post('/vendorLogin', validate(rules.login), vendorLogin)
router.use(Authenticate)
router.get('/profile', vendorProfile);
router.patch('/updateVendor', validate(rules.updateVendor), updateVendor);
router.patch('/updateVendorService', validate(rules.updateVendorService), updateVendorService);
router.patch('/updateVendorCoverImage', upload, updateVendorCoverImage);

router.post('/addFood', upload, requireImages, validate(rules.addFood), addFood)
router.get('/getFood', getFood)

// Orders 
router.get('/orders', getCurrentOrders);
router.get('/order/:id', getOrderDetails);
router.put('/order/:id/process', validate(rules.processOrder), ProcessOrder);

// Offers
router.get('/offers', GetOffers);
router.post('/addOffer', validate(rules.addOffer), AddOffer);
router.put('/editOffer/:id', validate(rules.editOffer), EditOffer);

export default router;