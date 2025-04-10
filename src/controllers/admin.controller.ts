import { Request, Response } from "express";
import { sendResponse } from "../utils";
import { AdminService } from "../services/admin.service";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";


export const CreateVendor = async (req: Request, res: Response): Promise<any> => {
    try {
        const createdVendor = await AdminService.createVendor(req);
        return sendResponse(res, StatusCodes.OK, messages.CREATE_VENDOR, { createdVendor })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

export const GetVendors = async (req: Request, res: Response): Promise<any> => {
    try {
        const vendors = await AdminService.getVendors(req);
        return sendResponse(res, StatusCodes.OK, messages.GET_VENDORS, { vendors })

    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

export const GetVendorById = async (req: Request, res: Response): Promise<any> => {
    try {
        const vendor = await AdminService.getVendorById(req);
        return sendResponse(res, StatusCodes.OK, messages.CREATE_VENDOR, { vendor })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};