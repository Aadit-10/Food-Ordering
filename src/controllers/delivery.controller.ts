import { Request, Response } from "express";
import { sendResponse } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { DeliveryService } from "../services";
import { plainToClass } from "class-transformer";
import { createDeliveryUserInputs, EditCustomerProfileInputs, UserLoginInputs } from "../dto";
import { validate } from "class-validator";

/**
 * Function for Delivery User Signup
 *
 * @param req
 * @param res
 */
export const DeliveryUserSignup = async (req: Request, res: Response): Promise<any> => {
    try {
        const signupInputs = plainToClass(createDeliveryUserInputs, req.body);
        const InputErrors = await validate(signupInputs, { validationError: { target: false } });
        if (InputErrors.length > 0) {
            const errorMessages = InputErrors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, StatusCodes.BAD_REQUEST, messages.DELIVERY_USER_SIGNUP_FAILED, errorMessages);
        }

        const profile = await DeliveryService.DeliveryUserSignup(signupInputs);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP, { profile });
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Delivery User Login
 *
 * @param req
 * @param res
 */
export const DeliveryUserLogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const loginInputs = plainToClass(UserLoginInputs, req.body);
        const InputErrors = await validate(loginInputs, { validationError: { target: false } });
        if (InputErrors.length > 0) {
            const errorMessages = InputErrors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, StatusCodes.BAD_REQUEST, messages.DELIVERY_USER_LOGIN_FAILED, errorMessages);
        }

        const result = await DeliveryService.DeliveryUserLogin(loginInputs);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_LOGIN_SUCCESS, result);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message,)
    }
};

/**
 * Function to get DeliveryUser Profile
 *
 * @param req
 * @param res
 */
export const GetDeliveryUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const profile = await DeliveryService.GetDeliveryUserProfile(req);
        return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_SIGNUP);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Editing DeliveryUser Profile
 *
 * @param req
 * @param res
 */
export const EditDeliveryUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const editInputs = plainToClass(EditCustomerProfileInputs, req.body);
        const InputErrors = await validate(editInputs, { validationError: { target: false } });
        if (InputErrors.length > 0) {
            const errorMessages = InputErrors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, StatusCodes.BAD_REQUEST, messages.CUSTOMER_LOGIN_FAILED, errorMessages);
        }
        await DeliveryService.EditDeliveryUserProfile(req, editInputs);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_EDIT_SUCCESS);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};

/**
 * Function for Editing DeliveryUser Profile
 *
 * @param req
 * @param res
 */
export const UpdateDeliveryUserStatus = async (req: Request, res: Response): Promise<any> => {
    try {

        await DeliveryService.updateDeliveryUserStatus(req);
        // return sendResponse(res, StatusCodes.OK, messages.CUSTOMER_EDIT_SUCCESS);
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)
    }
};


