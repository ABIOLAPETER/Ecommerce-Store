import jwt from "jsonwebtoken"
import HttpError from "../utils/handleError"; // Custom error utility

export const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new HttpError("Not authorized, no token", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return next(new HttpError("Not authorized, token failed", 401));
    }
});

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return next(new HttpError("Not authorized as admin", 403));
    }
};
