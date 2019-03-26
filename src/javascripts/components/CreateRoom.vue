<template>
  <div>
    <h2 class="ui dividing header">Create a new room</h2>
    <form @submit="onSubmit" class="ui fluid form">
      <div class="field">
        <label for="roomName">Room name</label>
        <input type="text" name="roomName" v-model="roomName" required>
      </div>
      <div class="field">
        <label for="roomDescription">Description for the room</label>
        <input type="text" name="roomDescription" v-model="roomDescription" required>
      </div>
      <button class="ui button">Create Room</button>
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
      this.$router.push('/rooms');
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
}
</style>
