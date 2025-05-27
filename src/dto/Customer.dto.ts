import { IsEmail, Length } from "class-validator";

export class createCustomerInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(7, 12)
    password: string;
}
export class UserLoginInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    password: string;
}

export class EditCustomerProfileInputs {

    @Length(3, 20)
    firstName: string;

    @Length(3, 20)
    lastName: string;

    @Length(6, 16)
    address: string;

}

export interface CustomerPayload {
    _id: any,
    email: string,
    verified: boolean
}

export class CartItem {
    _id: string;
    unit: number;
}

export class OrderInputs {
    txnId: string;
    amount: string;
    items: [CartItem];
}
export class createDeliveryUserInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(7, 12)
    password: string;

    @Length(3, 12)
    firstName: string;

    @Length(3, 12)
    lastName: string;

    @Length(6, 24)
    address: string;

    @Length(3, 12)
    pincode: string;
}