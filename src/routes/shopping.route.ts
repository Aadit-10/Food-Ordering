import { Router } from "express";
import { getFoodAvailability, getFoodIn30Min, getTopRestaurants, RestaurantById, searchFoods } from "../controllers";

const router = Router();

/**---------------- Food Availabilty ---------------- **/
router.get('/:pincode', getFoodAvailability)

/**---------------- Top Restaurents ---------------- **/
router.get('/top-restaurants/:pincode', getTopRestaurants);


/**---------------- Food Available in 30 min ---------------- **/
router.get('/foods-in-30-min/:pincode', getFoodIn30Min);

/**---------------- Search Foods ---------------- **/
router.get('/search/:pincode', searchFoods);


/**---------------- Find Restaurents By ID---------------- **/
router.get('/restaurants/:id', RestaurantById);

export default router;