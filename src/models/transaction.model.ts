import mongoose, { Schema, Document } from "mongoose";

export interface TranscationDoc extends Document {
    customer: string,
    vendorId: string,
    orderId: string,
    orderValue: number,
    offerUsed: string,
    status: string,
    paymentMode: string,
    paymentResponse: string,
}

const TranscationSchema = new Schema({
    customer: String,
    vendorId: String,
    orderId: String,
    orderValue: Number,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymentResponse: String,
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

export const Transcation = mongoose.model<TranscationDoc>('transaction', TranscationSchema);