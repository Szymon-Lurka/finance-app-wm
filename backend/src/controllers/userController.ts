import {NextFunction, Response} from 'express';
import {CustomRequest} from "../types/models/Request";
import type {ManageUserBody} from "../types/models/User";
import User from "../models/User";
import {BodyFieldsValidationError, UnauthorizedError, ValidationError} from "../utils/errors/AppError";
import {PASSWORD_VALIDATION_REGEX} from "../constants/regexes";
import errors from "../constants/errors";
import bcrypt from "bcryptjs";

const updateUser = async (req: CustomRequest<{}, ManageUserBody>, res: Response, next: NextFunction) => {
    const {firstName, lastName, password, username, currentPassword} = req.body;
    if (!currentPassword) {
        return next(new BodyFieldsValidationError('No current password provided', ['currentPassword']));
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new UnauthorizedError('Update user', 'Something is wrong. Try to log in again'))
    }
    if (!await bcrypt.compare(currentPassword, user.password as string)) {
        return next(new ValidationError('Wrong current password', 'Provided current password is incorrect'));
    }

    if (password) {
        if (!PASSWORD_VALIDATION_REGEX.test(password)) {
            return next(new ValidationError('Wrong password', errors.auth.password))
        }
        user.password = await bcrypt.hash(password, 10);
    }
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (username) {
        user.username = username;
    }
    await user.save();
    res.status(201).json({
        status: 'success',
        message: 'Successfully updated user',
        data: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    })
}

export {
    updateUser
}