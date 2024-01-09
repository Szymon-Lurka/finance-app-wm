import {createRouter, createWebHashHistory} from "vue-router";
import routes from "./routes";

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// TODO: Add guards (auth)

export default router;