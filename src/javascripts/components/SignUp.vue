<template>
  <div>
    <div>
      <h1>Sign up</h1>
      <form @submit="onSubmit">
        <label for="username">ユーザーネーム</label>
        <input type="text" name="username" v-model="userName" required>
        <label for="password">パスワード</label>
        <input type="password" name="password" v-model="password" required>
        <label for="passwordAgain">パスワード再確認</label>
        <input type="password" name="passwordAgain" v-model="passwordAgain" required>
        <p>{{ errorMessage }}</p>
        <button v-if="!errorMessage">Submit</button>
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
      password: '',
      passwordAgain: '',
      errorMessage: ''
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.$router.push('rooms');
      socket.emit('signUp', this.$data.userName, this.$data.password);
    }
  },
  watch: {
    passwordAgain: function() {
      if (this.password !== this.passwordAgain) {
        this.errorMessage = 'パスワードが一致しません';
      } else {
        this.errorMessage = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: #aaa;
}

p {
  color: red;
}
</style>
