import { plainToClass } from "class-transformer";
import { Request } from "express";
import { createCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInputs, } from "../dto";
import { validate } from "class-validator";
import { customError, GenerateOtp, generatePassword, generateSalt, generateToken, validatePassword } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";
import { Customer, Food } from "../models";
import { Order } from "../models/order.model";

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
    * Function for Creating an Order 
    *
    * @param req
    * @returns 
    */
    createOrder: async (req: Request) => {
        const customer = req.user;
        const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;
        const profile = await Customer.findById(customer._id);

        const cart = <[OrderInputs]>req.body;

        let cartItems = Array();
        let netAmount = 0.0;

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += (food.price * unit)
                }
            })
        });

        if (cartItems) {
            const currentOrder = await Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: 'Good',
                orderStatus: 'Waiting',
            })

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
        const { _id, unit } = <OrderInputs>req.body;
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
}