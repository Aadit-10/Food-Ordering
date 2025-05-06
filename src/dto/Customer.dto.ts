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


export class OrderInputs {
    _id: string;
    unit: number;
}
