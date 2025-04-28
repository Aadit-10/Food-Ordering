import { Router } from "express";
import AdminRoute from "./admin.route"
import VendorRoute from "./vendor.route"
import ShoppingRoute from "./shopping.route"


const router = Router();

router.use('/admin', AdminRoute)
router.use('/vendor', VendorRoute);
router.use('/shopping', ShoppingRoute);

export default router;