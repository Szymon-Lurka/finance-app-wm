import {NextFunction, Response} from 'express';
import {CustomRequest} from "../types/models/Request";
import type {ManageUserBody} from "../types/models/User";
import User from "../models/User";
import {BodyFieldsValidationError, UnauthorizedError, ValidationError} from "../utils/errors/AppError";
import {PASSWORD_VALIDATION_REGEX} from "../constants/regexes";
import errors from "../constants/errors";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import {getNow} from "../utils/date/DateUtils";

const updateUser = async (req: CustomRequest<{}, ManageUserBody>, res: Response, next: NextFunction) => {
    const {firstName, lastName, newPassword, repeatPassword, username, currentPassword} = req.body;
    if (newPassword) {
        const fields = [];
        if (!currentPassword) {
            fields.push('currentPassword')
        }
        if (!newPassword) {
            fields.push('newPassword');
        }
        if (fields.length > 0) {
            return next(new BodyFieldsValidationError('No current password provided', fields));
        }
    }
    if (newPassword !== repeatPassword) {
        return next(new BodyFieldsValidationError('Repeat password is different than current password', ['newPassword', 'currentPassword']));
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new UnauthorizedError('Update user', 'Something is wrong. Try to log in again'))
    }
    if (newPassword && currentPassword && !await bcrypt.compare(currentPassword, user.password as string)) {
        return next(new ValidationError('Wrong current password', 'Provided current password is incorrect'));
    }

    if (newPassword) {
        if (!PASSWORD_VALIDATION_REGEX.test(newPassword)) {
            return next(new ValidationError('Wrong password', errors.auth.password))
        }
        console.log(user.password);
        user.password = await bcrypt.hash(newPassword, 10);
        console.log(user.password);
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
    user.updatedAt = getNow();
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