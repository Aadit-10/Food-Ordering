import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto";
import { customError, sendResponse, validateToken } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const validate = await validateToken(req);

        if (validate) {
            next()
        } else {
            customError(StatusCodes.UNAUTHORIZED, messages.NOT_AUTHORISED)
        }
    } catch (error) {
        return sendResponse(res, error.statusCode, error.message)

    }


}