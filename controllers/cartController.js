import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import Product from "../models/productModel";
import HttpError from "../utils/handleError"; // Custom error utility

export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Assuming authentication middleware adds the `user` object to `req`

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HttpError("Product not found", 404));
    }

    // Get user and their cart
    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    // Check if product already exists in the cart
    const existingCartItem = user.cart.find(item => item.productId.toString() === productId);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
});




export const viewCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("cart.productId", "productName price image");
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    res.status(200).json({ cart: user.cart });
});



export const updateCartItem = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    const cartItem = user.cart.find(item => item.productId.toString() === productId);
    if (!cartItem) {
        return next(new HttpError("Product not in cart", 404));
    }

    if (quantity > 0) {
        cartItem.quantity = quantity;
    } else {
        // Remove item if quantity is 0
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    }

    await user.save();
    res.status(200).json({ message: "Cart updated", cart: user.cart });
});



export const removeCartItem = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await user.save();
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
});




export const clearCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared", cart: user.cart });
});
