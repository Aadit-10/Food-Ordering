import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from "./order.model";

interface CustomerDoc extends Document {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    salt: string,
    verified: boolean,
    otp: number,
    otp_expiry: Date,
    lat: number,
    lng: number,
    orders: [OrderDoc],
    cart: [any],
}

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    cart: [{
        food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
        unit: { type: Number, required: true }
    }],
    orders: [{
        food: { type: Schema.Types.ObjectId, ref: 'order' },
    }],
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

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)