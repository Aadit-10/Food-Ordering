import { Request } from "express";
import { CreateVendorInput, VendorLogin } from "../dto";
import { Delivery, Vendor } from "../models";
import { customError, generatePassword, generateSalt, generateToken, getPaginationParams, paginate, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Transcation } from "../models/transaction.model";

const findVendorByEmail = async (email) => {
    const vendorExists = await Vendor.findOne({
        email: email, status: { $ne: messages.DELETED_STATUS }
    })
    return vendorExists
}

export const AdminService = {

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

    /**
     * Function to create Vendors
     *
     * @param req
     * @returns 
     */
    createVendor: async (req: Request) => {
        const { name, ownerName, phone, address, email, password, pincode, foodTypes } = <CreateVendorInput>req.body;

        const vendorExist = await findVendorByEmail(email);

        if (vendorExist) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_EXISTS)
        }
        const salt = await generateSalt();
        const userPassword = await generatePassword(password, salt);

        const createdVendor = await Vendor.create({
            name, ownerName, phone, address, email,
            salt, password: userPassword, pincode, foodTypes,
            foods: [], lat: 0, lng: 0
        });
        return createdVendor
    },

    /**
     * Function to list all Vendors
     * 
     * @param req
     * @returns VendorsList
     */
    getVendors: async (req: Request) => {
        const searchText: any = req.query.search || '';
        const { page, limit, skip } = getPaginationParams(req);

        const query: any = {
            name: { $regex: searchText, $options: 'i' },
            status: { $ne: messages.DELETED_STATUS }
        }

        // let allVendors = await Vendor.find(query).
        //     sort({ createdAt: -1 }).limit(limit).skip(skip);

        // let totalItems: number = await Vendor.countDocuments(query);
        // let totalPages: number = Math.ceil(totalItems / limit);
        // const VendorsList = { allVendors, totalItems, totalPages };

        const VendorsList = await paginate({
            model: Vendor,
            query,
            page,
            limit,
            sort: { createdAt: -1 }
        });

        return VendorsList;
    },

    /**
    * Function to get a vendor by Id
    * 
    * @param req
    * @returns vendor
    */
    getVendorById: async (req: Request) => {
        const vendorId = req.params.id;
        const vendor = await Vendor.findOne({ _id: vendorId, status: { $ne: messages.DELETED_STATUS } })
        if (!vendor) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)
        }

        return vendor
    },
    /**
    * Function to get transactions
    * 
    * @param req
    * @returns vendor
    */
    getTransactions: async (req: Request) => {
        const { page, limit, skip } = getPaginationParams(req);
        const transactions = await paginate({
            model: Transcation,
            page,
            limit,
            sort: { createdAt: -1 }
        });
        if (!transactions) {
            customError(StatusCodes.BAD_REQUEST, messages.TRANSACTION_NOT_FOUND)
        }

        return transactions
    },
    /**
    * Function to get transaction by Id
    * 
    * @param req
    * @returns vendor
    */
    getTransactionById: async (req: Request) => {

        const transactionId = req.params.id;

        const transaction = await Transcation.findById(transactionId);
        if (!transaction) {
            customError(StatusCodes.BAD_REQUEST, messages.TRANSACTION_NOT_FOUND)
        }

        return transaction
    },

    /**
    * Function to verify Delivery User
    * 
    * @param req
    * @returns result
    */
    verifyDeliveryUser: async (req: Request) => {
        const { id, status } = req.body;
        const profile = await Delivery.findById(id);

        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS);
        }
        profile.verified = status;
        const result = await profile.save();
        return result;
    },

    /**
    * Function to verify Delivery User
    * 
    * @param req
    * @returns profiles
    */
    getDeliveryUsers: async (req: Request) => {
        const profiles = await Delivery.find();

        if (!profiles) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS);
        }

        return profiles;
    },
}