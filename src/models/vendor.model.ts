import mongoose, { Schema, Document, Model } from "mongoose";

interface VendorDoc extends Document {
    name: string,
    phone: string,
    address: string,
    email: string,
    password: string,
    pincode: string,
    foodTypes: [string],
    coverImage: [string],
    rating: string,
}

const VendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pincode: { type: String, required: true },
    coverImage: { type: [String] },
    rating: { type: String },
    foodTypes: { type: [String] },
}, {
    timestamps: true
});

export const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema)