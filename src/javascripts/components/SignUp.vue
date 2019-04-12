<template>
  <div>
    <div>
      <h2 class="ui dividing header">Sign up</h2>
      <form @submit="onSubmit" class="ui fluid form">
        <div class="field">
          <label for="username">ユーザーネーム</label>
          <input type="text" name="username" v-model="userName" required>
        </div>
        <div class="field">
          <label for="password">パスワード</label>
          <input type="password" name="password" v-model="password" required>
        </div>
        <div class="field">
          <label for="passwordAgain">パスワード再確認</label>
          <input type="password" name="passwordAgain" v-model="passwordAgain" required>
          <div class="ui pointing red label" v-if="errorMessage">{{ errorMessage }}</div>
        </div>
        <button class="ui secondary button" v-if="!errorMessage">Submit</button>
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
  created() {
    socket.on('signUpFailed', () => {
      this.errorMessage = 'ユーザーネームがすでに使われています。';
    });
    socket.on('signUpSucceed', () => {
      this.$router.push('/login');
    });
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.errorMessage = '';
      socket.emit('signUp', this.$data.userName, this.$data.password);
    }
  },
  watch: {
    passwordAgain: function() {
      if (this.password !== this.passwordAgain) {
        this.errorMessage = 'パスワードが一致しません';
        return;
      }
      this.errorMessage = '';
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  display: block;
}
</style>
