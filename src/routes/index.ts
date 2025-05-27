import { Router } from "express";
import AdminRoute from "./admin.route"
import VendorRoute from "./vendor.route"
import ShoppingRoute from "./shopping.route"
import CustomerRoute from './customer.route'
import DeliveryRoute from './delivery.route'

const router = Router();

router.use('/admin', AdminRoute)
router.use('/vendor', VendorRoute);
router.use('/shopping', ShoppingRoute);
router.use('/customer', CustomerRoute);
router.use('/delivery', DeliveryRoute);

export default router;