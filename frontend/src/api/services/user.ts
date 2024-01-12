import {axiosInstance} from "@/api";
import type {UpdateUserPayload, ResetUSerPayload} from "@/types/models/Auth";

const userService = {
    getMe: () => {
        return axiosInstance.get('/api/v1/auth/me')
    },
    getBalance: () => {
        return axiosInstance.get('/api/v1/user/total-balance')
    },
    updateUser: (payload: UpdateUserPayload) => {
        return axiosInstance.patch('/api/v1/user', payload);
    },
    resetUser: (payload: ResetUSerPayload) => {
        return axiosInstance.patch('/api/v1/user', payload);
    }
}

export {
    userService
}