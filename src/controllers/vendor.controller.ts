import { Request, Response } from "express";
import { VendorService } from "../services";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { sendResponse } from "../utils";

export const CreateVendor = async (req: Request, res: Response): Promise<any> => {
    try {
        const createdVendor = await VendorService.createVendor(req);
        return sendResponse(res, StatusCodes.OK, messages.CREATE_VENDOR, { createdVendor })
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

export const GetVendors = async (req: Request, res: Response): Promise<any> => {
    try {
        const vendors = await VendorService.getVendors(req);
        return sendResponse(res, StatusCodes.OK, messages.GET_VENDORS, { vendors })

    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }
};

export const GetVendorById = async (req: Request, res: Response): Promise<any> => {
    try {

    } catch (error) {

    }
};