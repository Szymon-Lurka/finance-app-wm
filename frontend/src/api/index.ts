import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import {authService} from "@/api/services/auth";
import {tokenService} from "@/helpers/tokenService";
import {Tokens} from "@/types/enums/TokensTypes";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    validateStatus: (status) => status >= 200 && status < 300
})

axiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = JSON.parse(authStore.token);
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    return config;
})

// Try to refresh token if response is unauthorized
axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        console.log('XD');
        const originalConfig = err.config;
        const authStore = useAuthStore();

        if (err.config.url.includes('/refresh-token')) {
            authStore.signOut();
            return Promise.reject(err);
        }

        if (err.response) {
            if (err.response.status === 401 && !originalConfig.retry) {
                if (!tokenService.getToken(Tokens.refresh)) {
                    authStore.signOut();
                    return Promise.reject(err);
                }
                originalConfig.retry = true;
                try {
                    const refreshTokenResponse = await authService.refreshToken();
                    const tokens = {
                        accessToken: refreshTokenResponse.data.token,
                        refreshToken: refreshTokenResponse.data.refreshToken,
                    };

                    tokenService.setTokens(tokens);
                    return axiosInstance(originalConfig);
                } catch (e) {
                    return Promise.reject(e);
                }
            }

            if (err.response.status === 401 && originalConfig.retry) {
                authStore.signOut();
            }
        }
        return Promise.reject(err);
    }
);

export {
    axiosInstance
}
