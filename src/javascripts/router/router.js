import Vue from 'vue';
import VueRouter from 'vue-router';

import TopPage from '../components/TopPage.vue';
import Rooms from '../components/Rooms.vue';
import ChatHome from '../components/ChatHome.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', component: TopPage },
    { path: '/rooms', component: Rooms },
    { path: '/rooms/:id/chat', name: 'Chat', component: ChatHome }
  ]
});
