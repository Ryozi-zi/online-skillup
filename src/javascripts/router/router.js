import Vue from 'vue';
import VueRouter from 'vue-router';

import CreateRoom from '../components/CreateRoom.vue';
import SignUp from '../components/SignUp.vue';
import LogIn from '../components/LogIn.vue';
import Rooms from '../components/Rooms.vue';
import ChatHome from '../components/ChatHome.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', component: SignUp },
    { path: '/createroom', component: CreateRoom },
    { path: '/login', component: LogIn },
    { path: '/rooms', component: Rooms },
    { path: '/rooms/:id/chat', name: 'Chat', component: ChatHome }
  ]
});
