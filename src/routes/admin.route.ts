import { Router } from "express";
import { adminMsg } from "../controllers";

const router = Router();

router.get('/adminMsg', adminMsg)

export default router;