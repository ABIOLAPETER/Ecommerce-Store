import asyncHandler from "express-async-handler";
import {User} from "../models/userModel.js";
import {Product} from "../models/productModel.js";
import {HttpError} from "../utils/handleError.js"; // Custom error utility

export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

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
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cart.productId", "productName price image");
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    res.status(200).json({ cart: user.cart });
});



export const updateCartItem = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

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
    const { productId } = req.params;
    const userId = req.user.id;

    // Validate productId
    if (!productId) {
        return next(new HttpError("Product ID is required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    // Check if the cart is empty
    if (!user.cart || user.cart.length === 0) {
        return next(new HttpError("Your cart is empty", 400));
    }

    // Filter out the item to be removed
    const updatedCart = user.cart.filter(item => item.productId.toString() !== productId);

    if (updatedCart.length === user.cart.length) {
        // If the item is not found in the cart
        return next(new HttpError("Product not found in cart", 404));
    }

    // Update the user's cart
    user.cart = updatedCart;

    await user.save();
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
});




export const clearCart = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const {cartId} = req.body
    const user = await User.findById(userId);
    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared", cart: user.cart });
});
