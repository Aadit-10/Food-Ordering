export interface CreateVendorInput {
    name: string,
    phone: string,
    address: string,
    email: string,
    password: string,
    pincode: string,
    foodTypes: [string],
}