import {Response} from "express";
import {CustomRequest} from "../types/models/Request";
import {LoginUserBody, RefreshTokenBody, UserBody} from "../types/models/Auth";
import {NextFunction} from "express";
import {
    BodyFieldsValidationError,
    createMongoDBError,
    NotFoundError, UnauthorizedError, ValidationError
} from "../utils/errors/AppError";
import {PASSWORD_VALIDATION_REGEX} from "../constants/regexes";
import bcrypt from "bcryptjs";
import User from "../models/User";
import {decodeJWT} from "../utils/tokens/decodeJWT";
import {createJWT} from "../utils/tokens/createTokens";
import errors from "../constants/errors";
import {validateRegisterBody} from "../utils/validators/authValidators";
import {messages} from "../constants/messages";

const register = async (req: CustomRequest<UserBody>, res: Response, next: NextFunction) => {
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

    try {
        const user = new User({username, password: hashedPassword, email, firstName, lastName});
        await user.save();
    } catch (e) {
        next(createMongoDBError(e));
    }

    res.status(201).json({
        status: 'created',
        message: messages.auth.accountCreated
    })
}

const login = async (req: CustomRequest<LoginUserBody>, res: Response, next: NextFunction) => {
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

const refreshToken = async (req: CustomRequest<RefreshTokenBody>, res: Response, next: NextFunction) => {
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

export {
    register,
    refreshToken,
    login,
}