import {Schema, model} from 'mongoose';
import validator from 'validator';
import {IUser} from "../types/models/User";


const userSchema = new Schema<IUser>({
    username: {type: String, required: [true, 'Please tell us your name!'], unique: true},
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
    resetPasswordToken: {type: String, required: false, select: false}
})



const User = model<IUser>('User', userSchema);
export default User;
