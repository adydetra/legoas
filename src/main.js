import PrimeVue from 'primevue/config';

import 'primeicons/primeicons.css';
import 'primevue/resources/themes/aura-light-green/theme.css';
import ConfirmationService from 'primevue/confirmationservice';

import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.mount('#app');
