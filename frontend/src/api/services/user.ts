import {axiosInstance} from "@/api";

const userService = {
    getMe: () => {
        return axiosInstance.get('/api/v1/auth/me')
    },
    getBalance: () => {
        return axiosInstance.get('/api/v1/auth/balance')
    },
    updateUser: (payload: any) => {
        return axiosInstance.patch('/api/v1/user', payload);
    }
}

export {
    userService
}