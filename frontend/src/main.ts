// import 'primevue/resources/themes/mdc-dark-indigo/theme.css'
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "./router";
import '@/styles/main.scss';
import PrimeVue from 'primevue/config';
import Ripple from "primevue/ripple";
import Badge from "primevue/badge";
import Menubar from "primevue/menubar";
import StyleClass from 'primevue/styleclass';
import Card from "primevue/card";
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';

const app = createApp(App);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Badge', Badge);
app.component('Menubar', Menubar);
app.component('Card', Card);
app.component('Toast', Toast);

app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass);

app.use(createPinia());
app.use(PrimeVue, {ripple: true, inputStyle: 'filled'});
app.use(router);
app.use(ToastService);

app.mount('#app');
