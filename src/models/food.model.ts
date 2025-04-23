import mongoose, { Schema, Document } from "mongoose";

interface FoodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: string;
    price: number;
    rating: number;
    images: [string]

}

const FoodSchema = new Schema({
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    images: { type: [String], required: true },

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

export const Food = mongoose.model<FoodDoc>('food', FoodSchema);