import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { sendResponse } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { plainToClass } from "class-transformer";
import { EditCustomerProfileInputs, UserLoginInputs } from "../dto";
import { validate } from "class-validator";

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

        const loginInputs = plainToClass(UserLoginInputs, req.body);
        const InputErrors = await validate(loginInputs, { validationError: { target: false } });
        if (InputErrors.length > 0) {
            const errorMessages = InputErrors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, StatusCodes.BAD_REQUEST, messages.CUSTOMER_LOGIN_FAILED, errorMessages);
        }

        const result = await CustomerService.CustomerLogin(loginInputs);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_LOGIN_SUCCESS, result);

    } catch (error) {
        return sendResponse(res, error.statusCode, error.message,)
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
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
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
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, profile);
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
        // Used for sending Validation messages by class-validator
        const editInputs = plainToClass(EditCustomerProfileInputs, req.body);
        const InputErrors = await validate(editInputs, { validationError: { target: false } });
        if (InputErrors.length > 0) {
            const errorMessages = InputErrors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, StatusCodes.BAD_REQUEST, messages.CUSTOMER_LOGIN_FAILED, errorMessages);
        }

        await CustomerService.EditCustomerProfile(req, editInputs);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_EDIT_SUCCESS);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

