import { Router } from "express";
import AdminRoute from "./admin.route"
import VendorRoute from "./vendor.route"

const router = Router();

router.use('/admin', AdminRoute)
router.use('/vendor', VendorRoute);

export default router;
