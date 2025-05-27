import { Request } from "express";
import { createDeliveryUserInputs, EditCustomerProfileInputs, UserLoginInputs } from "../dto";
import { customError, generatePassword, generateSalt, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Delivery } from "../models";


export const DeliveryService = {

    /**
    * Function for DeliveryUser Signup
    *
    * @param req
    * @returns sendData
    */
    DeliveryUserSignup: async (deliveryUserInput: createDeliveryUserInputs) => {
        const { email, phone, password, firstName, lastName, address, pincode } = deliveryUserInput;

        const existingDeliveryUser = await Delivery.findOne({ email });
        if (existingDeliveryUser) {
            customError(StatusCodes.BAD_REQUEST, messages.DELIVERY_USER_EXISTS)
        }

        const salt = await generateSalt()
        const userPassword = await generatePassword(password, salt);


        const result = await Delivery.create({
            email, password: userPassword, salt, phone,
            firstName, lastName, address, verified: false,
            lat: 0, lng: 0, isAvailable: false
        })

        if (!result) {
            customError(StatusCodes.BAD_REQUEST, messages.DELIVERY_USER_SIGNUP_FAILED)
        }
        const token = generateToken({ _id: result._id, email: result.email, verified: result.verified })
        let sendData = { token: token, verified: result.verified, email: result.email }
        return sendData;
    },

    /**
    * Function for DeliveryUser Login
    *
    * @param loginInputs
    * @returns 
    */
    DeliveryUserLogin: async (loginInputs: UserLoginInputs) => {
        const { email, password } = loginInputs;
        const profile = await Delivery.findOne({ email });

        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS);
        }

        const validation = await validatePassword(password, profile.password)

        if (!validation) {
            customError(StatusCodes.NOT_FOUND, messages.SOMETHING_WENT_WRONG);
        }

        const token = generateToken({
            _id: profile._id,
            email: profile.email,
            verified: profile.verified
        })
        let sendData = { token: token, verified: profile.verified, email: profile.email }
        return sendData;
    },



    /**
    * Function for DeliveryUser 
    *
    * @param req
    * @returns profile
    */
    GetDeliveryUserProfile: async (req: Request) => {
        const customer = req.user;

        const profile = await Delivery.findById(customer._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }

        return profile

    },

    /**
    * Function for edit DeliveryUser Profile 
    *
    * @param req
    * @returns 
    */
    EditDeliveryUserProfile: async (req: Request, editInputs: EditCustomerProfileInputs) => {
        const customer = req.user;
        const { firstName, lastName, address } = editInputs;

        const profile = await Delivery.findById(customer._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;

        await profile.save()

    },
    /**
    * Function for edit DeliveryUser Profile 
    *
    * @param req
    * @returns 
    */
    updateDeliveryUserStatus: async (req: Request) => {


    },



}