import 'element-plus/dist/index.css';
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "./router";
import '@/styles/main.scss';
import ElementPlus from 'element-plus';
import FontAwesomeIcon from '@/plugins/fontAwesome';

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(createPinia())
    .use(router)
    .use(ElementPlus)
    .mount('#app')

