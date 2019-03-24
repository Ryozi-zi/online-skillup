<template>
  <div>
    <form @submit="onSubmit">
      <label for="roomName">Room name</label>
      <input type="text" name="roomName" v-model="roomName" required>
      <label for="roomDescription">Description for the room</label>
      <input type="text" name="roomDescription" v-model="roomDescription" required>
      <button>Create Room</button>
    </form>
  </div>
</template>

<script>
import socket from '../utils/socket';

export default {
  data() {
    return {
      roomName: '',
      roomDescription: ''
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      socket.emit('createRoom', this.$data.roomName, this.$data.roomDescription);
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
}
</style>
