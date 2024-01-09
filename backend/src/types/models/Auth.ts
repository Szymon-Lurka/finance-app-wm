interface UserBody {
    username: string;
    password: string;
    email: string;
    lastName: string;
    firstName: string;
}

interface GetQuestionBody {
    email: string;
}

interface ResetPasswordBody {
    token: string;
    newPassword: string;
    email: string;
}
interface ForgotPasswordBody {
    email: string;
    answer: string;
}

interface JWTBody {
    id?: string;
    email?: string;
}
interface IUser {
    username: string;
    password: string | undefined;
    firstName: string;
    lastName: string;
    email: string;
    refreshToken: string | null | undefined;
    resetPasswordToken: string | null | undefined;
    _id: string;
}

interface RefreshTokenBody {
    refreshToken: string;
}

interface LoginUserBody {
    username?: string;
    email?: string;
    password: string;
}

export {
    UserBody,
    LoginUserBody,
    IUser,
    RefreshTokenBody,
    JWTBody,
    ForgotPasswordBody,
    GetQuestionBody,
    ResetPasswordBody,
}
