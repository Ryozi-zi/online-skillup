<template>
  <div class="container">
    <h2>Room List</h2>
    <ul class="roomList">
      <li v-for="room in roomList">
        <router-link :to="{ name: 'Chat', params: room }">
          <div>
            <h3>{{ room.room_name }}</h3>
            <p>{{ room.room_description }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import socket from '../utils/socket';

export default {
  data() {
    return {
      roomList: []
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

.roomList {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

li {
  list-style: none;
  width: 30%;
  box-sizing: border-box;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 1.5rem #b7b7b7;
  transition: transform ease 0.5s, box-shadow ease 0.5s;

  &:hover {
    transform: scale(1.05, 1.05);
    box-shadow: 0 5px 1.5rem #b7b7b7;
  }
}

a {
  display: block;
  padding: 2rem 2rem;
  color: black;
  text-decoration: none;
}
</style>
