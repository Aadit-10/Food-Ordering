import { plainToClass } from "class-transformer";
import { Request } from "express";
import { createCustomerInputs, } from "../dto";
import { validate } from "class-validator";
import { customError, GenerateOtp, generatePassword, generateSalt } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Customer } from "../models";

export const CustomerService = {

    /**
    * Function for Customer Signup
    *
    * @param req
    * @returns 
    */
    CustomerSignup: async (req: Request) => {
        const customerInput = plainToClass(createCustomerInputs, req.body);
        console.log("customerInput");
        const InputErrors = await validate(customerInput, { validationError: { target: true } });

        if (InputErrors) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_SIGNUP_FAILED)
        }


        const { email, phone, password } = customerInput;
        const salt = await generateSalt()
        const userPassword = await generatePassword(password, salt);

        const { otp, expiry } = GenerateOtp();

        console.log(' otp, expiry ', otp, expiry);
        // const result = await Customer.create({
        //     email,
        //     password: userPassword,
        //     salt,
        //     otp,
        //     otp_expiry: expiry,
        //     firstName: '',
        //     lastName: '',
        //     address: '',
        //     lat: 0,
        //     lng: 0,
        // })
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