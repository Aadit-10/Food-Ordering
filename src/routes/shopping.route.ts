import { Router } from "express";
import { getFoodAvailability, getFoodIn30Min, getTopRestaurants, RestaurantById, searchFoods, searchOffers } from "../controllers";
import { rules, validate } from "../middlewares";

const router = Router();

/**---------------- Food Availabilty ---------------- **/
router.get('/:pincode', getFoodAvailability)

/**---------------- Top Restaurents ---------------- **/
router.get('/top-restaurants/:pincode', validate(rules.getTopRestaurants), getTopRestaurants);


/**---------------- Food Available in 30 min ---------------- **/
router.get('/foods-in-30-min/:pincode', validate(rules.getFoodIn30Min), getFoodIn30Min);

/**---------------- Search Foods ---------------- **/
router.get('/searchFoods/:pincode', searchFoods);

/**---------------- Find Offers ---------------- **/
router.get('/searchOffers/:pincode', searchOffers);

/**---------------- Find Restaurents By ID---------------- **/
router.get('/restaurants/:id', RestaurantById);

export default router;