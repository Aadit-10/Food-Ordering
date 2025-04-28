import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { sendResponse } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

/**
 * Function for Customer Signup
 *
 * @param req
 * @param res
 */
export const customerSignup = async (req: Request, res: Response): Promise<any> => {
    try {
        await CustomerService.CustomerSignup(req);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};