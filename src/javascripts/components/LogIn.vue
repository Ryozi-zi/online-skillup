<template>
  <div>
    <div>
      <h2>{{ errorMessage }}</h2>
      <form @submit="onSubmit" class="ui form">
        <h1 class="ui dividing header">Login</h1>
        <div class="field">
          <label for="username">ユーザーネーム</label>
          <input type="text" name="username" v-model="userName" required>
        </div>
        <div class="field">
          <label for="password">パスワード</label>
          <input type="password" name="password" v-model="password" required>
        </div>
        <button class="ui secondary button" :disabled="!(userName && password)">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import socket from '../utils/socket';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      userName: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    onSubmit(e) {
      e.preventDefault();
      socket.emit('login', this.$data.userName, this.$data.password);
    }
  },
  created() {
    socket.on('loginSucceed', (userName) => {
      this.login(userName);
      this.$router.push('rooms');
    });
    socket.on('loginFailed', () => { this.$data.errorMessage = 'ユーザーネームまたはパスワードが違います。'; });
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: #aaa;
}

.content {
  color: black;
}
</style>
