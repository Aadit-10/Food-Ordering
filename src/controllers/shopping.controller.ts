import { Request, Response } from "express";
import { ShoppingService } from "../services";
import { sendResponse } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

/**
 * Function to Get Food Availability
 *
 * @param req
 * @param res
 */
export const getFoodAvailability = async (req: Request, res: Response): Promise<any> => {
    try {
        const foodAvailable = await ShoppingService.getFoodAvailability(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_AVAILABILITY, { foodAvailable })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Description
 *
 * @param req
 * @param res
 */
export const getTopRestaurants = async (req: Request, res: Response): Promise<any> => {
    try {
        const topRestaurants = await ShoppingService.getTopRestaurants(req);
        return sendResponse(res, StatusCodes.OK, messages.TOP_RESTAURANTS_FOUND, { topRestaurants });
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
* Description
*
* @param req
* @param res
*/
export const getFoodIn30Min = async (req: Request, res: Response): Promise<any> => {
    try {
        const foodIn30Min = await ShoppingService.getFoodIn30Min(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_AVAILABILITY, { foodIn30Min })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
* Description
*
* @param req
* @param res
*/
export const searchFoods = async (req: Request, res: Response): Promise<any> => {
    try {
        const foods = await ShoppingService.searchFoods(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_AVAILABILITY, { foods })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
* Description
*
* @param req
* @param res
*/
export const RestaurantById = async (req: Request, res: Response): Promise<any> => {
    try {
        const restaurants = await ShoppingService.RestaurantById(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_AVAILABILITY, { restaurants })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};