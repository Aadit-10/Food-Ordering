import { Request } from "express";
import { CreateOfferInput, CreateVendorInput, EditVendorInput, VendorLogin } from "../dto";
import { Food, Offer, Vendor } from "../models";
import { customError, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { createFoodInput } from "../dto/Food.dto";
import { Order } from "../models/order.model";

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

        const token: String = generateToken({
            _id: vendor._id,
            email: vendor.email,
            name: vendor.name,
            foodTypes: vendor.foodTypes,
        });
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
        const existingVendor = await findVendorById(user._id)

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
            const existingVendor = await findVendorById(user._id)
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
            const existingVendor = await findVendorById(user._id)
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
        const { lat, lng } = req.body;

        const existingVendor = await findVendorById(user._id)
        if (!existingVendor) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)
        }
        if (lat & lng) {
            existingVendor.lat = lat;
            existingVendor.lng = lng;
        }
        existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

        const savedResult = await existingVendor.save();
        return savedResult

    },

    /**
    * Function to Add Food
    *
    * @param req
    * @returns 
    */
    addFood: async (req: Request) => {
        const user: any = req.user;

        const { name, description, category, foodType, readyTime, price } = <createFoodInput>req.body;
        const vendor = await findVendorById(user._id);
        if (!vendor) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        const files = req.files as [Express.Multer.File]
        const images = files.map((file: Express.Multer.File) => file.filename)

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
            const foods = await Food.find({ vendorId: user._id })
            if (foods) {
                return foods
            }
        }
        customError(StatusCodes.BAD_REQUEST, messages.SOMETHING_WENT_WRONG)

    },

    /**
    * Function to Current Orders
    *
    * @param req
    * @returns orders
    */
    getCurrentOrders: async (req: Request) => {
        const user: any = req.user;
        const orders = await Order.find({ vendorId: user._id }).populate('items.food');
        if (orders === null) {
            customError(StatusCodes.BAD_REQUEST, messages.ORDER_NOT_FOUND)
        }
        return orders
    },

    /**
    * Function to Get Order Details
    *
    * @param req
    * @returns order
    */
    GetOrderDetails: async (req: Request) => {
        const orderId: any = req.params.id;
        const order = await Order.findById(orderId).populate('items.food');
        if (!order) {
            customError(StatusCodes.BAD_REQUEST, messages.ORDER_NOT_FOUND)
        }
        return order
    },

    /**
    * Function to Process Orders ie Change status, add remarks & readyTime
    *
    * @param req
    * @returns orderResult
    */
    ProcessOrder: async (req: Request) => {
        const orderId: any = req.params.id;
        const { status, remarks, readyTime } = req.body;

        const order = await Order.findById(orderId).populate('items.food');
        order.orderStatus = status;
        order.remarks = remarks;
        order.readyTime = readyTime;

        const orderResult = await order.save();
        if (!orderResult) {
            customError(StatusCodes.BAD_REQUEST, messages.SOMETHING_WENT_WRONG)
        }
        return orderResult
    },

    /**
    * Function to GetOffers
    *
    * @param req
    * @returns 
    */
    GetOffers: async (req: Request) => {
        const user = req.user;

        const offers = await Offer.find({ isActive: true }).populate('vendors');
        const currentOffers = offers.filter(offer => {
            if (offer.offerType === 'GENERIC') return true;

            return offer.vendors?.some(vendor => vendor._id.toString() === user._id);
        });

        return currentOffers
    },

    /**
    * Function to Add Offers
    *
    * @param req
    * @returns 
    */
    AddOffer: async (req: Request) => {
        const user = req.user;
        const {
            title, description, offerType, offerAmount,
            pincode, promoCode, promoType, startValidity,
            endValidity, bank, bins, minValue, isActive
        } = <CreateOfferInput>req.body

        const vendor = await findVendorById(user._id);
        if (!vendor) {
            customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)
        }

        const offer = await Offer.create({
            title, description, offerType, offerAmount,
            pincode, promoCode, promoType, startValidity,
            endValidity, bank, bins, minValue, isActive,
            vendors: [vendor]
        });

        if (!offer) {
            customError(StatusCodes.BAD_REQUEST, messages.OFFER_NOT_CREATED)
        }
    },

    /**
    * Function to Edit Offers
    *
    * @param req
    * @returns 
    */
    EditOffer: async (req: Request) => {
        const user = req.user;
        const offerId = req.params.id;
        const {
            title, description, offerType, offerAmount,
            pincode, promoCode, promoType, startValidity,
            endValidity, bank, bins, minValue, isActive
        } = <CreateOfferInput>req.body

        const currentOffer = await Offer.findById(offerId);
        if (!currentOffer) {
            customError(StatusCodes.BAD_REQUEST, messages.OFFER_NOT_EXIST)
        }
        const fields: Partial<CreateOfferInput> = {
            ...(title && { title }),
            ...(description && { description }),
            ...(offerType && { offerType }),
            ...(offerAmount && { offerAmount }),
            ...(pincode && { pincode }),
            ...(promoCode && { promoCode }),
            ...(promoType && { promoType }),
            ...(startValidity && { startValidity }),
            ...(endValidity && { endValidity }),
            ...(bank && { bank }),
            ...(bins && { bins }),
            ...(minValue && { minValue }),
            ...(isActive && { isActive }),
        }
        const newOffer = await Offer.findByIdAndUpdate({ _id: offerId }, { $set: fields }, { new: true });
        if (!newOffer) {
            customError(StatusCodes.BAD_REQUEST, messages.OFFER_NOT_EDITED)
        }
        return newOffer
    },
}