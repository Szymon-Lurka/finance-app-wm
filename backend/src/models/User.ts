import {Schema, model} from 'mongoose';
import validator from 'validator';
import {IUser} from "../types/models/User";


const userSchema = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email!']
    },
    refreshToken: {type: String, required: false, select: false},
    resetPasswordToken: {type: String, required: false, select: false},
    createdAt: {type: String},
    updatedAt: {type: String},
    balance: {type: Number, default: 0}
})


const User = model<IUser>('User', userSchema);
export default User;
