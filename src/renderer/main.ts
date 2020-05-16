import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import config from '@/baseConfig';
import '@/renderer/style/index.styl';
import bus from '@/renderer/bus';

Vue.config.productionTip = false;


// axios.interceptors.request.use(function(config){
//   console.warn("request config:",config);
  
//   // config.headers.Cookie = axiosApiCookie;
//   return config;
// },function(error){
//   return Promise.reject(error);
// });

axios.defaults.withCredentials = true;

Vue.prototype._http = axios;
Vue.prototype._config = config;
Vue.prototype._bus = bus;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
