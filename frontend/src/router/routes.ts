import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Default',
        redirect: '/auth'
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () => import(/* webpackChunkName: 'auth-page' */ '@/views/Auth/Auth.vue'),
        redirect: '/auth/login',
        children: [
            {
                path: '/auth/login',
                name: 'Login',
                component: () => import(/* webpackChunkName: 'login-page'*/ '@/views/Login/Login.vue')
            },
            {
                path: '/auth/register',
                name: 'Register',
                component: () =>
                    import(/* webpackChunkName: "register-page" */ '@/views/Register/Register.vue'),
            },
            {
                path: '/auth/forgot-password',
                name: 'ForgotPassword',
                component: () =>
                    import(
                        /* webpackChunkName: "forgot-password-page" */ '@/views/ForgotPassword/ForgotPassword.vue'
                        ),
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
            import(/* webpackChunkName: "dashboard-page" */ '@/views/Dashboard/Dashboard.vue'),
        redirect: '/dashboard/home',
        children: [
            {
                path: '/dashboard/home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "home-page" */ '@/views/Home/Home.vue'),
            },
            {
                path: '/dashboard/categories',
                name: 'Categories',
                component: () => import(/* webpackChunkName: "categories-page" */ '@/views/Categories/Categories.vue'),
            },
            {
                path: '/dashboard/user',
                name: 'User',
                component: () => import(/*  webpackChunkName: 'user-page' */  '@/views/User/User.vue')
            }
        ]
    }
];

export default routes;