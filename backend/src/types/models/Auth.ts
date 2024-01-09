interface UserBody {
    username: string;
    password: string;
    email: string;
    lastName: string;
    firstName: string;
}

interface JWTBody {
    id: string;
}
interface IUser {
    username: string;
    password: string | undefined;
    firstName: string;
    lastName: string;
    email: string;
    refreshToken: string | null | undefined;
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
    JWTBody
}