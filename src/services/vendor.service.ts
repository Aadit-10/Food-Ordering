import { Request } from "express";
import { CreateVendorInput, VendorLogin } from "../dto";
import { Vendor } from "../models";
import { customError, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

const findVendorByEmail = async (email) => {
    const vendorExists = await Vendor.findOne({
        email: email, status: { $ne: messages.DELETED_STATUS }
    })
    return vendorExists
}
const findVendorById = async (id) => {
    const vendorExists = await Vendor.findOne({
        _id: id, status: { $ne: messages.DELETED_STATUS }
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

        const vendor: any = await findVendorByEmail(email);
        const existingVendor = await validatePassword(password, vendor.password);
        if (!existingVendor) {
            customError(StatusCodes.NOT_FOUND, messages.LOGIN_VENDOR_FAILED)
        };

        const token: String = generateToken(vendor._id.toString());
        vendor.token = token;
        await vendor.save();
        return vendor;
    },
    /**
       * Function to Login Vendors
       *
       * @param req
       * @returns 
       */
    vendorProfile: async (req: Request) => {
        const user = req.user
        if (!user) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_FOUND)
        }
        console.log("user", user);
        const existingVendor = await findVendorById(user.id)
        console.log("existingVendor", existingVendor);

        return existingVendor
    },

}