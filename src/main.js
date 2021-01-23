import Vue from 'vue';
import App from './App.vue';
// import "./registerServiceWorker";
import router from './router';
import '@/assets/scss/main.scss';

import axios from '@/helpers/axios';
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
