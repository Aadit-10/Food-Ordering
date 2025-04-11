export interface VendorLogin {
    email: string,
    password: string,
}
export interface CreateVendorInput {
    name: string,
    ownerName: string,
    phone: string,
    address: string,
    email: string,
    password: string,
    pincode: string,
    foodTypes: [string],
}

export interface VendorPayload {
    id: string,
    email: string,
    name: string,
    foodTypes: string,
}