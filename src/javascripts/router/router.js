import Vue from 'vue';
import VueRouter from 'vue-router';

import ChatHome from '../components/ChatHome.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/chat', component: ChatHome }
  ]
});
