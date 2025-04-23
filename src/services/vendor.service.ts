import { Request } from "express";
import { CreateVendorInput, EditVendorInput, VendorLogin } from "../dto";
import { Food, Vendor } from "../models";
import { customError, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { createFoodInput } from "../dto/Food.dto";

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
    * Function to Get Vendor Profile
    *
    * @param req
    * @returns 
    */
    vendorProfile: async (req: Request) => {
        const user = req.user
        if (!user) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_FOUND)
        }
        const existingVendor = await findVendorById(user.id)

        return existingVendor
    },

    /**
    * Function to Edit Vendor Profile
    *
    * @param req
    * @returns 
    */
    updateVendorProfile: async (req: Request) => {
        const { address, name, phone, foodTypes } = <EditVendorInput>req.body;
        const user = req.user
        if (user) {
            const existingVendor = await findVendorById(user.id)
            if (existingVendor) {
                existingVendor.name = name;
                existingVendor.address = address;
                existingVendor.phone = phone;
                existingVendor.foodTypes = foodTypes;

                const savedResult = await existingVendor.save();
                return savedResult
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)

    },
    /**
   * Function to Update Vendor Cover Image
   *
   * @param req
   * @returns result
   */
    updateVendorCoverImage: async (req: Request) => {
        const user = req.user
        if (user) {
            const existingVendor = await findVendorById(user.id)
            if (existingVendor) {

                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                existingVendor.coverImage.push(...images);

                const result = await existingVendor.save()
                return result
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)

    },

    /**
    * Function to Edit Vendor Service Availability
    *
    * @param req
    * @returns 
    */
    updateVendorService: async (req: Request) => {
        const user = req.user
        if (user) {
            const existingVendor = await findVendorById(user.id)
            if (existingVendor) {
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

                const savedResult = await existingVendor.save();
                return savedResult
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)

    },

    /**
    * Function to Add Food
    *
    * @param req
    * @returns 
    */
    addFood: async (req: Request) => {
        const user: any = req.user;
        if (user) {
            const { name, description, category, foodType, readyTime, price } = <createFoodInput>req.body;
            const vendor = await findVendorById(user.id);
            if (vendor) {
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                console.log("images", images);

                const createdFood = await Food.create({
                    vendorId: vendor._id,
                    name: name,
                    description: description,
                    category: category,
                    foodType: foodType,
                    readyTime: readyTime,
                    price: price,
                    rating: 0,
                    images: images,
                })

                vendor.foods.push(createdFood);
                const result = await vendor.save();
                return result
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.SOMETHING_WENT_WRONG)
    },

    /**
    * Function to Get Food
    *
    * @param req
    * @returns
    */
    getFood: async (req: Request) => {
        const user: any = req.user;
        if (user) {
            const foods = await Food.find({ vendorId: user.id })
            if (foods) {
                return foods
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.SOMETHING_WENT_WRONG)

    },
}