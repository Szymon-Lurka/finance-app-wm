import {createRouter, createWebHashHistory} from "vue-router";
import routes from "./routes";
import {authGuard} from "@/router/guards";

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(authGuard);

export default router;