import mongoose, { Schema, Types } from "mongoose";

// Schema for individual reviews
const reviewSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to the User who left the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String, required: true }, // Optional review comment
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});


// Export the model
export const Review = mongoose.model('Review', reviewSchema);
