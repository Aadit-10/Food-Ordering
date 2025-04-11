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