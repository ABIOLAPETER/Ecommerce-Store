import asyncHandler from "express-async-handler";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import {HttpError} from "../utils/handleError.js"; // Custom error utility

export const placeOrder = asyncHandler(async (req, res, next) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return next(new HttpError("No items in the order", 400));
    }

    // Calculate the total price
    let totalPrice = 0;
    for (let item of orderItems) {
        const product = await Product.findById(item.productId);

        if (!product) {
            return next(new HttpError(`Product not found: ${item.productId}`, 404));
        }

        if (product.stock < item.quantity) {
            return next(new HttpError(`Not enough stock for product: ${product.productName}`, 400));
        }

        // Deduct stock
        product.stock -= item.quantity;
        await product.save();

        // Add to total price
        totalPrice += product.price * item.quantity;
    }

    // Create the order
    const order = new Order({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});




export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
        return next(new HttpError("Invalid status", 400));
    }

    // Find and update the order
    const order = await Order.findById(id);
    if (!order) {
        return next(new HttpError("Order not found", 404));
    }

    order.status = status;

    // If delivered, set the delivery timestamp
    if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
});



export const getOrders = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const orders = isAdmin
        ? await Order.find().populate("user", "name email")
        : await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
        return next(new HttpError("No orders found", 404));
    }

    res.status(200).json(orders);
});
