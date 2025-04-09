import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

export const sendResponse = async (res: Response, statusCode: number, message: string, data?: object) => {
    const responseCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const responseMessage = message || messages.SERVER_ERROR;

    const jsonData: any = {
        ...(data && { data }),
        message: responseMessage,
        statusCode: responseCode,
    }

    return res.status(responseCode).json(jsonData)
}