<template>
  <div>
    <div>
      <form @submit="onSubmit">
        <h1>Login</h1>
        <label for="username">ユーザーネーム</label>
        <input type="text" name="username" v-model="userName" required>
        <label for="password">パスワード</label>
        <input type="password" name="password" v-model="password" required>
        <button>Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import socket from '../utils/socket';

export default {
  data() {
    return {
      userName: '',
      password: ''
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      socket.emit('login', this.$data.userName, this.$data.password);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: #aaa;
}
</style>
