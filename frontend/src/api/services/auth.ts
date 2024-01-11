import {axiosInstance} from "../index";
import {tokenService} from "@/helpers/tokenService";
import {Tokens} from "@/types/enums/TokensTypes";
import type {LoginPayload} from "@/types/models/Auth";

const authService = {
    login: (payload: LoginPayload) => {
        return axiosInstance.post<{test:string}>('/api/v1/auth/login', {
            email: payload.email,
            password: payload.password
        })
    },
    refreshToken() {
        return axiosInstance.post('/api/v1/auth/refresh-token', {
            refreshToken: tokenService.getToken(Tokens.refresh)
        })
    },
    register: (payload: any) => {
        return axiosInstance.post('/api/v1/auth/register', payload)
    }
}
export {authService}
