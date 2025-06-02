import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from "./order.model";

interface DeliveryDoc extends Document {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    pincode: string,
    phone: string,
    salt: string,
    verified: boolean,
    lat: number,
    lng: number,
    isAvailable: boolean
}

const DeliverySchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    isAvailable: { type: Boolean },

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password,
                delete ret.__v,
                delete ret.createdAt,
                delete ret.updatedAt
        }
    },
    timestamps: true
});

export const Delivery = mongoose.model<DeliveryDoc>('delivery', DeliverySchema)