import { plainToClass } from "class-transformer";
import { Request } from "express";
import { createCustomerInputs, } from "../dto";
import { validate } from "class-validator";
import { customError, GenerateOtp, generatePassword, generateSalt, generateToken } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Customer } from "../models";

export const CustomerService = {

    /**
    * Function for Customer Signup
    *
    * @param req
    * @returns sendData
    */
    CustomerSignup: async (req: Request) => {
        const customerInput = plainToClass(createCustomerInputs, req.body);
        const InputErrors = await validate(customerInput, { validationError: { target: true } });

        if (InputErrors.length > 0) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_SIGNUP_FAILED)
            return InputErrors
        }
        const { email, phone, password } = customerInput;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_EXISTS)
        }

        const salt = await generateSalt()
        const userPassword = await generatePassword(password, salt);

        const { otp, expiry } = GenerateOtp();

        const result = await Customer.create({
            email,
            password: userPassword,
            salt,
            phone,
            otp,
            otp_expiry: expiry,
            firstName: '',
            lastName: '',
            address: '',
            verified: false,
            lat: 0,
            lng: 0,
        })

        if (!result) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_SIGNUP_FAILED)
        }
        const token = generateToken({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        let sendData = {
            token: token,
            verified: result.verified,
            email: result.email
        }
        return sendData;
    },

    /**
    * Function for Customer Login
    *
    * @param req
    * @returns 
    */
    CustomerLogin: async (req: Request) => {

    },

    /**
    * Function for Customer 
    *
    * @param req
    * @returns 
    */
    CustomerVerify: async (req: Request) => {
        const { otp } = req.body;
        const user = req.user;

        if (!user) {
            customError(StatusCodes.UNAUTHORIZED, messages.NOT_AUTHORISED);
        }

        const profile = await Customer.findById(user._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS);
        }

        const isOtpValid = profile.otp === parseInt(otp);
        const isOtpNotExpired = profile.otp_expiry >= new Date();

        if (!isOtpValid || !isOtpNotExpired) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_VERIFY_FAILED);
        }

        profile.verified = true;
        await profile.save();

        const token = generateToken({ _id: profile._id, email: profile.email, verified: profile.verified });

        return { token, verified: profile.verified, email: profile.email };
    },

    /**
    * Function for Customer 
    *
    * @param req
    * @returns 
    */
    RequestOtp: async (req: Request) => {

    },

    /**
    * Function for Customer 
    *
    * @param req
    * @returns 
    */
    GetCustomerProfile: async (req: Request) => {

    },

    /**
    * Function for Customer 
    *
    * @param req
    * @returns 
    */
    EditCustomerProfile: async (req: Request) => {

    },
}