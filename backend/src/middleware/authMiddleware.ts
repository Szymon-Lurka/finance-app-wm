import jwt from "jsonwebtoken";
import {NextFunction} from "express";
import {UnauthorizedError} from "../utils/errors/AppError";
import User from "../models/User";
import catchAsync from "../utils/errors/catchAsync";
import {CustomRequest} from "../types/models/Request";
import errors from "../constants/errors";

const verifyToken = catchAsync(async (req: CustomRequest<{}, {
    authorization?: string;
}>, _: Response, next: NextFunction) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new UnauthorizedError('JWT', errors.auth.invalidToken))
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
    } catch (e) {
        return next(new UnauthorizedError('JWT expired', errors.auth.invalidToken));
    }
    const freshUser = await User.findById((decoded as any).id);
    if (!freshUser) {
        return next(
            new UnauthorizedError('User does not exist', errors.auth.tokenIsValidUserNotExists)
        )
    }
    req.user = freshUser as any;
    next();
})

export default verifyToken;
