interface User {
    balance: number;
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    _id: string;
}

interface UpdatePassword {
    newPassword: string;
    currentPassword: string;
    repeatPassword: string;
}

interface UpdateUserData {
    username?: string;
    firstName?: string;
    lastName?: string;
}

type UpdateUserPayload = UpdatePassword | UpdateUserData;

interface LoginPayload {
    email: string;
    password: string;
}

export type {
    User,
    LoginPayload,
    UpdateUserPayload
}
