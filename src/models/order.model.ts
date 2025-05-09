import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string,
    vendorId: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers: string,
    offerId: string,
    readyTime: number,
}

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [{
        food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
        unit: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    paidThrough: { type: String, required: true },
    paymentResponse: { type: String, required: true },
    orderStatus: { type: String, required: true },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: String },
    offerId: { type: String },
    readyTime: { type: Number },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v,
                delete ret.createdAt,
                delete ret.updatedAt
        }
    },
    timestamps: true
})

export const Order = mongoose.model<OrderDoc>('order', OrderSchema);