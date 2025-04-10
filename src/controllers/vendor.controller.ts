import { Request, Response } from "express";
import { VendorService } from "../services";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { sendResponse } from "../utils";


export const vendorLogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const newVendor = await VendorService.vendorLogin(req);
        return sendResponse(res, StatusCodes.OK, messages.LOGIN_VENDOR, newVendor)
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

