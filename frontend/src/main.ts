import 'element-plus/dist/index.css';
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "./router";
import '@/styles/main.scss';
import ElementPlus from 'element-plus';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(ElementPlus)
    .mount('#app')

