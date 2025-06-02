import { plainToClass } from "class-transformer";
import { Request } from "express";
import { CartItem, createCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInputs, } from "../dto";
import { validate } from "class-validator";
import { customError, GenerateOtp, generatePassword, generateSalt, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Customer, Delivery, Food, Offer, Order, Transcation, Vendor } from "../models";

const validateTransaction = async (txnId: string) => {
    const currentTransaction = await Transcation.findById(txnId);
    if (!currentTransaction) {
        customError(StatusCodes.BAD_REQUEST, messages.TRANSACTION_NOT_FOUND)
    }
    if (currentTransaction.status.toLowerCase() !== 'failed') {
        return { status: true, currentTransaction }
    }

    return { status: false, currentTransaction }
}

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
        customError(StatusCodes.BAD_REQUEST, messages.VENDOR_NOT_EXIST)
    }

    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorLng = vendor.lng;

    const deliveryPerson = await Delivery.find({ pincode: areaCode, verified: true, isAvailable: true });

    if (!deliveryPerson) {
        customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
    }
    // check the nearest Delivery person and assign the order

    const currentOrder: any = await Order.findById(orderId);
    if (!currentOrder) {
        customError(StatusCodes.BAD_REQUEST, messages.ORDER_NOT_FOUND)
    }

    currentOrder.deliveryId = deliveryPerson[0]._id;
    await currentOrder.save();
    // Notify Vendor of Order Recieved
}

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
            orders: [],
        })

        if (!result) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_SIGNUP_FAILED)
        }
        const token = generateToken({ _id: result._id, email: result.email, verified: result.verified })
        let sendData = { token: token, verified: result.verified, email: result.email }
        return sendData;
    },

    /**
    * Function for Customer Login
    *
    * @param loginInputs
    * @returns 
    */
    CustomerLogin: async (loginInputs: UserLoginInputs) => {
        const { email, password } = loginInputs;
        const profile = await Customer.findOne({ email });

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
        const customer = req.user;

        const profile = await Customer.findById(customer._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        const { otp, expiry } = GenerateOtp()
        profile.otp = otp;
        profile.otp_expiry = expiry;

        await profile.save()
        return profile

    },

    /**
    * Function for Customer 
    *
    * @param req
    * @returns profile
    */
    GetCustomerProfile: async (req: Request) => {

        const customer = req.user;

        const profile = await Customer.findById(customer._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }

        return profile
    },

    /**
    * Function for edit Customer Profile 
    *
    * @param req
    * @returns 
    */
    EditCustomerProfile: async (req: Request, editInputs: EditCustomerProfileInputs) => {

        const customer = req.user;
        const { firstName, lastName, address } = editInputs;

        const profile = await Customer.findById(customer._id);
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;

        await profile.save()
    },

    /**
    * Function for Creating Payment
    *
    * @param req
    * @returns 
    */
    createPayment: async (req: Request) => {
        const user = req.user;
        const { amount, paymentMode, offerId } = req.body;
        let payableAmount = Number(amount);
        if (offerId) {
            const appliedOffer = await Offer.findById(offerId);
            if (appliedOffer) {
                payableAmount -= appliedOffer.offerAmount
            }
        }

        // Perform Payment gateway Charge API call

        // Create Record of transcation
        const transaction = await Transcation.create({
            customer: user._id,
            vendorId: '',
            orderId: '',
            orderValue: payableAmount,
            offerUsed: offerId || 'NA',
            status: 'OPEN', //Failed // Success
            paymentMode: paymentMode,
            paymentResponse: 'Payment is COD'
        })
        // return trasactionId 
        return transaction
    },

    /**
    * Function for Creating an Order 
    *
    * @param req
    * @returns 
    */
    createOrder: async (req: Request) => {
        const customer = req.user;

        const { txnId, amount, items } = <OrderInputs>req.body;
        const { status, currentTransaction } = await validateTransaction(txnId)
        if (!status) {
            customError(StatusCodes.BAD_REQUEST, messages.TRANSACTION_NOT_FOUND)
        }

        const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;
        const profile = await Customer.findById(customer._id);

        let cartItems = Array();
        let netAmount = 0.0;
        let vendorId;

        const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

        foods.map(food => {
            items.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += (food.price * unit)
                    cartItems.push({ food, unit })
                }
            })
        });

        if (cartItems) {
            const currentOrder: any = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45,
            })

            profile.cart = [] as any;

            currentTransaction.vendorId = vendorId;
            currentTransaction.orderId = orderId;
            currentTransaction.status = messages.CONFIRMED
            await currentTransaction.save()

            assignOrderForDelivery(currentOrder._id, vendorId);

            if (currentOrder) {
                profile.orders.push(currentOrder)
                await profile.save();
                return currentOrder
            }

        }

    },

    /**
     * Function for getting all the orders 
     *
     * @param req
     * @returns 
     */
    getOrder: async (req: Request) => {
        const customer = req.user;
        const profile = (await Customer.findById(customer._id)).populated('orders');
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        // add pagination here
        return profile.orders
    },

    /**
    * Function for getting order by id 
    *
    * @param req
    * @returns 
    */
    getOrderById: async (req: Request) => {
        const orderId: any = req.params.id;
        const order = await Order.findOne(orderId).populate('items.food')
        return order
    },

    /**
    * Function for adding to cart 
    *
    * @param req
    * @returns 
    */
    updateCart: async (req: Request) => {
        const customer = req.user;
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        const { _id, unit } = <CartItem>req.body;
        const food = await Food.findById(_id);
        if (!food) {
            customError(StatusCodes.BAD_REQUEST, messages.FOOD_NOT_FOUND)
        }

        let cartItems = Array();
        cartItems = profile.cart;
        cartItems = cartItems.filter(item => item.food !== null && item.food !== undefined);

        const existingIndex = cartItems.findIndex(item => item.food._id.toString() === _id);

        if (existingIndex !== -1) {
            if (unit > 0) {
                cartItems[existingIndex].unit = unit; // ✅ update unit
            } else {
                cartItems.splice(existingIndex, 1); // ✅ remove item if unit is 0
            }
        } else {
            if (unit > 0) {
                cartItems.push({ food, unit }); // ✅ add new item
            }
        }
        profile.cart = cartItems as any;
        const cartResult = await profile.save();
        return cartResult.cart;
    },

    /**
    * Function to Get Cart Items
    *
    * @param req
    * @returns 
    */
    getCartItems: async (req: Request) => {
        const customer = req.user;
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        return profile.cart
    },

    /**
    * Function for Deleting Cart
    *
    * @param req
    * @returns 
    */
    deleteFromCart: async (req: Request) => {
        const customer = req.user;
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (!profile) {
            customError(StatusCodes.BAD_REQUEST, messages.CUSTOMER_NOT_EXISTS)
        }
        profile.cart = [] as any;
        await profile.save();
    },

    /**
    * Function for Deleting Cart
    *
    * @param req
    * @returns 
    */
    verifyOffer: async (req: Request) => {
        const offerId: any = req.params.id;

        const appliedOffer = await Offer.findById(offerId)
        if (!appliedOffer) {
            customError(StatusCodes.BAD_REQUEST, messages.OFFER_NOT_VALID)
        }

        if (appliedOffer.promoType === 'USER') {
            // Offer can be applied only once
        } else {
            if (appliedOffer.isActive) {
                return appliedOffer
            } else {
                customError(StatusCodes.OK, messages.OFFER_NOT_VALID)
            }
        }
    },



}