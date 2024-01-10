interface IUser {
    username: string;
    password: string | undefined;
    firstName: string;
    lastName: string;
    email: string;
    refreshToken: string | null | undefined;
    resetPasswordToken: string | null | undefined;
    createdAt: string;
    updatedAt: string;
    balance: number;
    _id: string;
}

interface UserBody {
    username: string;
    password: string;
    email: string;
    lastName: string;
    firstName: string;
}

interface ManageUserBody {
    currentPassword: string;
    username?: string;
    password?: string;
    lastName?: string;
    firstName?: string;
}

export {
    ManageUserBody,
    IUser,
    UserBody
}