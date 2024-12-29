import asyncHandler from "express-async-handler";
import path from "path";
import { v4 as uuid } from "uuid";
import Product from "../models/productModel";
import cloudinary from "../config/cloudinary";
import HttpError from "../utils/handleError"; // Custom error utility

export const addProduct = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(new HttpError("Only Admin can add products", 403));
    }

    const { productName, price, description } = req.body;

    // Input validation
    if (!productName || !price || !description) {
        return next(new HttpError("All fields are required", 400));
    }

    // Check if product already exists
    const productExists = await Product.findOne({ productName });

    if (productExists) {
        return next(new HttpError("Product already exists", 400));
    }

    // Check if an image file is provided
    if (!req.files || !req.files.image) {
        return next(new HttpError("Choose an image", 422));
    }

    const { image } = req.files;

    // Validate image size (limit to 1MB)
    if (image.size > 1000000) {
        return next(new HttpError("Image size too big. Should be less than 1MB", 422));
    }

    // Generate a unique filename for the image
    const fileName = `${path.parse(image.name).name}_${uuid()}${path.extname(image.name)}`;
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);

    try {
        // Move the image to the server's uploads folder
        await image.mv(uploadPath);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            resource_type: "image",
        });

        // Delete the local file after successful upload
        await fs.promises.unlink(uploadPath);

        // Create and save the product
        const newProduct = await Product.create({
            productName,
            price,
            description,
            image: result.secure_url,
        });

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (err) {
        // Handle file upload or Cloudinary errors
        return next(new HttpError(err.message || "Failed to upload image", 500));
    }
});



export const viewProducts = asyncHandler(async (req, res, next) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // If no products exist, return an error
        if (products.length === 0) {
            return next(new HttpError("No products found in the database", 404));
        }

        // Respond with the fetched products
        return res.status(200).json({ products });
    } catch (error) {
        // Handle any unexpected errors
        return next(new HttpError(error.message || "Failed to fetch products", 500));
    }
});

export const updateProducts = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(new HttpError("Only Admin can add products", 403));
        }
        const { productName, price, description } = req.body;
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid product ID", 400));
        }

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return next(new HttpError("Product not found", 404));
        }

        // Input validation
        if (!productName || !price || !description) {
            return next(new HttpError("All fields are required", 400));
        }

        // Check if an image file is provided
        if (!req.files || !req.files.image) {
            return next(new HttpError("Choose an image", 422));
        }

        const { image } = req.files;

        // Validate image size (limit to 1MB)
        if (image.size > 1000000) {
            return next(new HttpError("Image size too big. Should be less than 1MB", 422));
        }

        // Generate a unique filename for the image
        const fileName = `${path.parse(image.name).name}_${uuid()}${path.extname(image.name)}`;
        const uploadPath = path.join(__dirname, "..", "uploads", fileName);

        // Move the image to the server's uploads folder
        await image.mv(uploadPath);

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            resource_type: "image",
        });

        // Delete the local file after successful upload
        await fs.promises.unlink(uploadPath);

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                productName,
                price,
                description,
                image: result.secure_url,
            },
            { new: true } // Return the updated document
        );

        // Respond with the updated product
        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return next(new HttpError(error.message || "Failed to update product", 500));
    }
});


export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    try {
        if (!req.user.isAdmin) {
            return next(new HttpError("Only Admin can add products", 403));
        }
        await Product.findByIdAndDelete(id)
        res.json({
            msg: "Product deleted succesfully"
        })
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return next(new HttpError(error.message || "Failed to update product", 500));
    }
})
