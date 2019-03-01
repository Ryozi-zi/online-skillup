<template>
<div>
  <p>
    <img class="logo" src="../images/logo.jpg" alt="ロゴ">
    <span class="sample">サンプルコード</span>
  </p>
  <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
  <MyComponent :message="$data.message" />
  <form @submit="onSubmit">
    <input type="text" v-model="userName">
    <input v-model="$data.text" type="text" required>
    <button type="submit">送信</button>
  </form>
  <div v-html="identicon"></div>
  <ul>
    <li v-for="chat in chats">
      {{ chat }}
    </li>
  </ul>
</div>
</template>

<script>
import socket from './utils/socket';
const jdenticon = require('jdenticon');

// components
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  data() {
    return {
      userName: '',
      message: '',
      text: '',
      chats: [],
      errorMessage: ''
    };
  },
  created() {
    socket.on('connect', () => {
      console.log('connected!');
      // チャットログを受け取るためにcreatedでgetChatLogを送信
      socket.emit('getChatLog', () => {});
      console.log('getting chat log');
    });

    socket.on('setChatLog', (messages) => {
      // サーバーからチャットの配列を受け取って追加
      this.chats.push(...messages);
      console.log(messages);
    });

    socket.on('send', (message) => {
      // messageが空欄だった場合にエラーメッセージを表示
      if (message) {
        console.log(message);
        this.$data.message = message;
        this.chats.push(message);
      } else {
        this.errorMessage = '投稿内容を入力してください';
      }
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      socket.emit('send', this.$data.text);
      this.text = '';
      this.errorMessage = '';
    }
  },
  computed: {
    identicon() {
      return jdenticon.toSvg(this.userName, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.sample {
  color: $red;
}
</style>
