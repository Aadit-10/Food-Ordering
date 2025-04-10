import { Request } from "express";
import { CreateVendorInput, VendorLogin } from "../dto";
import { Vendor } from "../models";
import { customError, generatePassword, generateSalt, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

const findVendorByEmail = async (email) => {
    const vendorExists = await Vendor.findOne({
        email: email, status: { $ne: messages.DELETED_STATUS }
    })
    return vendorExists
}

export const VendorService = {

    /**
    * Function to Login Vendors
    *
    * @param req
    * @returns 
    */
    vendorLogin: async (req: Request) => {
        const { email, password } = <VendorLogin>req.body;

        const vendor = await findVendorByEmail(email);
        const existingVendor = await validatePassword(password, vendor.password);
        if (!existingVendor) {
            customError(StatusCodes.NOT_FOUND, messages.LOGIN_VENDOR_FAILED)
        };

        return vendor;
    },


}