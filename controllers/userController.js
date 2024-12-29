import {generateToken} from "../Utils/generateToken.js";
import asyncHandler from "express-async-handler";
import {User} from "../models/userModel.js";
// import HttpError from "../utils/handleError.js"; // Custom error utility

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password, // Password will be hashed in userModel pre-save hook
    });


    // Assign admin role if email matches
    if (user.email === process.env.ADMIN_EMAIL) {
        user.isAdmin = true;
        await user.save(); // Save changes to the user
    }
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    const token = await generateToken({id: user._id, isAdmin: user.isAdmin})

    if (user && (await user.matchPassword(password))) { // Use matchPassword from userModel
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
