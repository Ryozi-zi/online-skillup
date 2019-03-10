import '../css/base.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router/router.js';

new Vue({
  el: '#app',
  components: { App },
  template: '<app />',
  router
});
