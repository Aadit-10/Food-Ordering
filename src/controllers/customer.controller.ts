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
        const profile = await CustomerService.CustomerSignup(req);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Customer Login
 *
 * @param req
 * @param res
 */
export const customerLogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile = await CustomerService.CustomerLogin(req);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Customer Verify
 *
 * @param req
 * @param res
 */
export const customerVerify = async (req: Request, res: Response): Promise<any> => {
    try {
        const verifiedData = await CustomerService.CustomerVerify(req);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_VERIFY_SUCCESS, verifiedData);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function to  request Otp
 *
 * @param req
 * @param res
 */
export const RequestOtp = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile = await CustomerService.RequestOtp(req);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function to get customer Profile
 *
 * @param req
 * @param res
 */
export const GetCustomerProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile = await CustomerService.GetCustomerProfile(req);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Editing Customer Profile
 *
 * @param req
 * @param res
 */
export const EditCustomerProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile = await CustomerService.EditCustomerProfile(req);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

