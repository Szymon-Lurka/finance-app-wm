import {NextFunction, Response} from "express";
import {CustomRequest} from "../types/models/Request";
import {ForgotPasswordBody, LoginUserBody, RefreshTokenBody, ResetPasswordBody} from "../types/models/Auth";
import {
    BaseError,
    BodyFieldsValidationError,
    createMongoDBError,
    NotFoundError,
    UnauthorizedError,
    ValidationError
} from "../utils/errors/AppError";
import {PASSWORD_VALIDATION_REGEX} from "../constants/regexes";
import bcrypt from "bcryptjs";
import User from "../models/User";
import {decodeJWT} from "../utils/tokens/decodeJWT";
import {createJWT, createResetPasswordToken} from "../utils/tokens/createTokens";
import errors from "../constants/errors";
import {validateRegisterBody} from "../utils/validators/authValidators";
import {messages} from "../constants/messages";
import handlebars from "handlebars";
import {getResetPasswordTemplate, nodemailerSetup} from "../utils/email/nodemailerSetup";
import {HttpStatusCode} from "../types/enums/HttpStatusCode";
import {UserBody} from "../types/models/User";
import FinancialEntry from "../models/FinancialEntry";
import * as mongoose from "mongoose";

const forgotPassword = async (req: CustomRequest<{}, ForgotPasswordBody>, res: Response, next: NextFunction) => {
    const {email} = req.body;

    if (!email) {
        return next(new BodyFieldsValidationError('Forgot password email', ['email']))
    }

    const resetPasswordToken = createResetPasswordToken(email);
    const user = await User.findOneAndUpdate({email}, {resetPasswordToken});
    if (!user) {
        return next(new NotFoundError('Not found', 'User with provided email doesn\'t exists.'));
    }

    const templateFile = getResetPasswordTemplate();
    const template = handlebars.compile(templateFile);
    const data = {link: `${process.env.CLIENT_URL}/forgot-password/${resetPasswordToken}`, name: user.firstName};

    const mailOptions = {
        from: process.env.NODEMAILER_OPT_MAIL,
        to: user.email,
        subject: 'Resetowanie hasła',
        html: template(data),
    }

    const transporter = nodemailerSetup();
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error mail', error);
            return next(new BaseError('Forgot password', HttpStatusCode.INTERNAL_SERVER, '', true));
        } else {
            console.log('Email sent: ', info.response);
            res.status(201).send({
                status: 'success',
                message: 'Email sent successfully!'
            });
        }
    })
};

const resetPassword = async (req: CustomRequest<{}, ResetPasswordBody>, res: Response, next: NextFunction) => {
    const {token, newPassword} = req.body;

    if (!token) {
        return next(new BodyFieldsValidationError('Wrong reset password token', ['token']))
    }

    if (!newPassword || !PASSWORD_VALIDATION_REGEX.test(newPassword)) {
        return next(new ValidationError('Wrong password reset password', errors.auth.password))
    }

    const decodedToken = decodeJWT(token);
    const userEmail = decodedToken?.email;

    const user = await User.findOne({email: userEmail}).select('+resetPasswordToken');

    if (!user) {
        return next(new NotFoundError('Not found', 'User with provided email doesn\'t exists.'));
    }

    if (user.resetPasswordToken !== token) {
        user.resetPasswordToken = null;
        await user.save();
        return next(new ValidationError('Wrong token reset password', 'Token for password reset is incorrect.'))
    }

    decodeJWT(token);

    // Everything is ok, so we're saving new password and deleting resetPasswordToken
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    await user.save();

    res.status(201).json({
        status: 'success',
        message: 'Successfully changed password'
    })
}

const register = async (req: CustomRequest<{}, UserBody>, res: Response, next: NextFunction) => {
    const {username, password, email, lastName, firstName} = req.body;
    const invalidFields = validateRegisterBody({
        username,
        password,
        email,
        lastName,
        firstName
    });

    if (invalidFields.length > 0) {
        return next(new BodyFieldsValidationError('Register wrong data', invalidFields))
    }

    // Checking the password here, because we send a hash to mongoDB, so it is impossible to check the conditions there
    if (!PASSWORD_VALIDATION_REGEX.test(password)) {
        return next(new ValidationError('Wrong password', errors.auth.password))
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    try {
        const user = new User({username, password: hashedPassword, email, firstName, lastName, createdAt});
        await user.save();
    } catch (e) {
        next(createMongoDBError(e));
    }

    res.status(201).json({
        status: 'created',
        message: messages.auth.accountCreated
    })
}

const login = async (req: CustomRequest<{}, LoginUserBody>, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;
    const user = await User.findOne(username ? {username} : {email}).select('+password');
    if (!user) {
        return next(new NotFoundError('Not found', 'User not exists'));
    }

    if (!password || !user || !(await bcrypt.compare(password, user.password as string))) {
        return next(new ValidationError('Login', errors.auth.login))
    }
    await createJWT(user, 200, res);
};

const refreshToken = async (req: CustomRequest<{}, RefreshTokenBody>, res: Response, next: NextFunction) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
        return next(new UnauthorizedError('RefreshToken', errors.auth.refreshToken))
    }

    try {
        const decoded = decodeJWT(refreshToken);
        if (!decoded) {
            return next(new UnauthorizedError('RefreshToken', errors.auth.refreshToken))
        }

        const user = await User.findOne({_id: decoded.id}).select('+refreshToken');
        if (user?.refreshToken !== refreshToken) {
            return next(new UnauthorizedError('RefreshToken', errors.auth.refreshToken))
        }

        user.refreshToken = undefined;
        await createJWT(user, 200, res);
    } catch (e) {
        return next(new UnauthorizedError('RefreshToken', errors.auth.refreshToken))
    }
};

const getMe = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: user
    })
}

export {
    register,
    refreshToken,
    login,
    forgotPassword,
    resetPassword,
    getMe,
}