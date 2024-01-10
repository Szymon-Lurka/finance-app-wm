import {useCache} from "@/composables/useCache";
import {Tokens} from "@/types/enums/TokensTypes";
import {useAuthStore} from "@/stores/authStore";

const {setItem, getItem, removeItem} = useCache();

interface TokensPayload {
    [Tokens.refresh]: string;
    [Tokens.access]: string;
}

const tokenService = {
    getToken(type: Tokens): string | null {
        const token = getItem(type)?.data;
        return token ? JSON.parse(token) : null;
    },
    setRefreshToken(refreshToken: string) {
        if (!refreshToken) return;
        setItem(Tokens.refresh, JSON.stringify(refreshToken), false);
    },
    setAccessToken(accessToken: string) {
        if (!accessToken) return;
        const authStore = useAuthStore();
        const token = JSON.stringify(accessToken);
        authStore.token = token;
        setItem(Tokens.access, token, false);
    },
    setTokens(payload: TokensPayload) {
        this.setRefreshToken(payload.refreshToken);
        this.setAccessToken(payload.accessToken);
    },
    clearTokens() {
        removeItem(Tokens.access);
        removeItem(Tokens.refresh);
    },
}

export {
    tokenService
}