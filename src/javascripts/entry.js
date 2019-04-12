import '../css/base.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router/router.js';
import store from './store';

new Vue({
  el: '#app',
  components: { App },
  template: '<app />',
  router,
  store
});
