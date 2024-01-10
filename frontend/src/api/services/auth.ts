import {axiosInstance} from "../index";
import {tokenService} from "@/helpers/tokenService";
import {Tokens} from "@/types/enums/TokensTypes";

const authService = {
    login: (payload: any) => {
        return axiosInstance.post('/api/v1/auth/login', {
            email: payload.email,
            password: payload.password
        })
    },
    refreshToken() {
        return axiosInstance.post('/api/v1/auth/refresh-token', {
            refreshToken: tokenService.getToken(Tokens.refresh)
        })
    }
}
export {authService}
