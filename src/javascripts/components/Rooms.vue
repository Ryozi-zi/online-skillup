<template>
  <div class="container">
    <h2>Room List</h2>
    <div class="ui link cards">
      <div v-for="room in roomList" class="ui card">
        <router-link :to="{ name: 'Chat', params: room }" class="content">
          <h3 class="header black">{{ room.room_name }}</h3>
          <p class="description black">{{ room.room_description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../utils/socket';

export default {
  data() {
    return {
      roomList: [],
    };
  },
  created() {
    this.getRoomList();
    this.setRoomList();
  },
  methods: {
    getRoomList() {
      socket.emit('getRoomList', () => {});
    },
    setRoomList() {
      socket.on('setRoomList', (rooms) => {
        this.roomList.push(...rooms);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
}
</style>
