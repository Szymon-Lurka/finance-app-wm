import { defineStore } from 'pinia';
import {getInitialAccessToken, getInitialRefreshToken} from '@/helpers/accessTokens';
import { authService } from '@/api/services/auth';
import { tokenService } from '@/helpers/tokenService';
import router from '@/router';

const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getInitialAccessToken(),
    refreshToken: getInitialRefreshToken()
  }),
  actions: {
    async signIn({ email, password }) {
      try {
        const { data } = await authService.login({
          email,
          password,
        });
        const tokens = {
          refreshToken: data.refreshToken,
          accessToken: data.token,
        };

        tokenService.setTokens(tokens);

        router.push({ name: 'Dashboard' });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    signOut() {
      this.token = null;
      this.refreshToken = null;
      tokenService.clearTokens();
      router.push({ name: 'Auth' });
    },
    async register({ email, password, firstName, lastName, username }) {
      try {
        await authService.register({
          email,
          password,
          firstName,
          lastName,
          username,
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async forgotPassword({ email }) {
      try {
        await authService.forgotPassword({ email });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token || !!state.refreshToken,
  },
});

export { useAuthStore };
