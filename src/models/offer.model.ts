import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
    offerType: string; //VENDOR, GENERIC
    vendors: [any];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number; // 200
    startValidity: Date;
    endValidity: Date;
    promoCode: string;
    promoType: string; // User //Bank //ALL
    bank: [any]
    bins: [any]
    pincode: string;
    isActive: boolean;
}

const OfferSchema = new Schema({
    offerType: { type: String, required: true },
    vendors: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'vendor' }
    ],
    title: { type: String, required: true },
    description: { type: String, required: true },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [
        { type: String }
    ],
    bins: [
        { type: String }
    ],
    pincode: { type: String, required: true },
    isActive: { type: Boolean },
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

export const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);