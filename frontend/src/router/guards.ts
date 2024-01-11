import {useAuthStore} from "@/stores/authStore";
import type {RouteLocationNormalized} from "vue-router";

const authGuard = async (to: RouteLocationNormalized) => {
    const authStore = useAuthStore();
    let userIsOnAuth = false;

    if (to.name === 'Login' || to.name === 'Register' || to.name === 'ForgotPassword' || to.name === 'ResetPassword') {
        userIsOnAuth = true;
    }
    if (authStore.isAuthenticated && userIsOnAuth) return {name: 'Dashboard'};
    if (!authStore.isAuthenticated && !userIsOnAuth) return {name: 'Auth'};
};

export {authGuard};