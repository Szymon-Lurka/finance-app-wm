
interface ResetPasswordBody {
    token: string;
    newPassword: string;
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
    username?: string;
    email?: string;
    password: string;
}

export {
    LoginUserBody,
    RefreshTokenBody,
    JWTBody,
    ForgotPasswordBody,
    ResetPasswordBody,
}
