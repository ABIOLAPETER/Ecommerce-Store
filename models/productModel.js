import mongoose, { Schema, Types } from "mongoose";

// Schema for individual reviews
const reviewSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to the User who left the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String, required: true }, // Optional review comment
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Schema for products
const productSchema = new Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true }, // Changed to Number for calculations
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema], // Embedded review schema
    averageRating: { type: Number, default: 0 }, // For displaying the average rating of the product
    numReviews: { type: Number, default: 0 } // Count of total reviews
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
export const Product = mongoose.model('Product', productSchema);
