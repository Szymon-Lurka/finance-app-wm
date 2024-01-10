import {defineStore} from "pinia";
import {getInitialAccessToken} from "@/helpers/accessTokens";
import {authService} from "@/api/services/auth";
import {tokenService} from "@/helpers/tokenService";
import router from "@/router";

const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getInitialAccessToken()
    }),
    actions: {
        async signIn({email, password}) {
            try {
                const {data} = await authService.login({
                    email,
                    password
                })
                const tokens = {
                    refreshToken: data.refreshToken,
                    accessToken: data.token
                };

                tokenService.setTokens(tokens);

                router.push({name: 'Dashboard'})
            } catch (e) {
                console.log(e);
            }
        },
        signOut() {
            this.token = null;
            tokenService.clearTokens();
            router.push({name: 'Auth'});
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token
    }
})

export {
    useAuthStore
}