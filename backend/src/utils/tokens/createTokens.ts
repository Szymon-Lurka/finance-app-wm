import {Response} from "express";
import jwt from 'jsonwebtoken';
import User from "../../models/User";
import {IUser} from "../../types/models/User";

const createResetPasswordToken = (email: string) => jwt.sign({email}, process.env.JWT_SECRET_KEY || '', {expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN});
const signToken = (id: string) =>
    jwt.sign({id}, process.env.JWT_SECRET_KEY || '', {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

const signRefreshToken = (id: string) => jwt.sign({id}, process.env.JWT_SECRET_KEY || '', {
    expiresIn: process.env.REFRESH_EXPIRES_IN
});

const createJWT = async (user: IUser, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.password = undefined;
    await User.findOneAndUpdate({_id: user._id}, {refreshToken});

    res.status(statusCode).json({
        status: 'success',
        token,
        refreshToken,
        data: {
            user
        }
    })
}

export {
    createJWT,
    createResetPasswordToken
}
