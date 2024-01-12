import {defineStore} from "pinia";
import type {User} from "@/types/models/Auth";
import {userService} from "@/api/services/user";

const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User,
        balance: null as number
    }),
    actions: {
        async fetchMe() {
            try {
                const {data: userData} = await userService.getMe();
                this.user = userData.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchBalance() {
            try {
                const {data} = await userService.getBalance();
                this.balance = data.balance;
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        getUser: (state) => state.user,
        getBalance: (state) => state.balance,
        isUserLoaded: (state) => !!state.user
    }
})

export {
    useUserStore
}