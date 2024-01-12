
interface ResetPasswordBody {
    token: string;
    newPassword: string;
    repeatPassword: string;
}
interface ForgotPasswordBody {
    email: string;
    answer: string;
}

interface JWTBody {
    id?: string;
    email?: string;
}


interface RefreshTokenBody {
    refreshToken: string;
}

interface LoginUserBody {
    email: string;
    password: string;
}

export {
    LoginUserBody,
    RefreshTokenBody,
    JWTBody,
    ForgotPasswordBody,
    ResetPasswordBody,
}
