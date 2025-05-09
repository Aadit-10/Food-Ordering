import { Request, Response } from "express";
import { VendorService } from "../services";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { sendResponse } from "../utils";

/**
 * Function to Login Vendor
 *
 * @param req
 * @param res
 */
export const vendorLogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const newVendor = await VendorService.vendorLogin(req);
        return sendResponse(res, StatusCodes.OK, messages.LOGIN_VENDOR, newVendor)
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function to Get Vendor Profile
 *
 * @param req
 * @param res
 */
export const vendorProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile: any = await VendorService.vendorProfile(req);
        return sendResponse(res, StatusCodes.OK, messages.VENDOR_PROFILE, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function to Update Vendor
 *
 * @param req
 * @param res
 */
export const updateVendor = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile: any = await VendorService.updateVendorProfile(req);
        return sendResponse(res, StatusCodes.OK, messages.EDIT_VENDOR_PROFILE_SUCCESS, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};
/**
 * Function to Update Vendor Cover Image
 *
 * @param req
 * @param res
 */
export const updateVendorCoverImage = async (req: Request, res: Response): Promise<any> => {
    try {
        await VendorService.updateVendorCoverImage(req);
        return sendResponse(res, StatusCodes.OK, messages.VENDOR_IMAGE_UPDATED);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

/**
 * Function to Update Vendor Service Availability
 *
 * @param req
 * @param res
 */
export const updateVendorService = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile: any = await VendorService.updateVendorService(req);
        return sendResponse(res, StatusCodes.OK, messages.EDIT_VENDOR_SERVICE_SUCCESS, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

/**
 * Function to AddFood
 *
 * @param req
 * @param res
 */
export const addFood = async (req: Request, res: Response): Promise<any> => {
    try {
        await VendorService.addFood(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_ADDED);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

/**
 * Function to Get Food
 *
 * @param req
 * @param res
 */
export const getFood = async (req: Request, res: Response): Promise<any> => {
    try {
        const foods = await VendorService.getFood(req);
        return sendResponse(res, StatusCodes.OK, messages.FOOD_FETCHED, { foods });
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

/**---------------- Orders ---------------- **/

/**
 * Function to Get Current Order
 *
 * @param req
 * @param res
 */
export const getCurrentOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const orders = await VendorService.getCurrentOrders(req);
        return sendResponse(res, StatusCodes.OK, messages.ORDER_FETCHED, { orders });
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
export const getOrderDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const order = await VendorService.GetOrderDetails(req);
        return sendResponse(res, StatusCodes.OK, messages.ORDER_FETCHED, { order });
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
export const ProcessOrder = async (req: Request, res: Response): Promise<any> => {
    try {

    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};