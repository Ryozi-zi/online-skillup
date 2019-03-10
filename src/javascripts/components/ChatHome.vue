<template>
<div v-cloak class="container">
  <h1>{{ $route.params.room_name }}</h1>
  <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
  <user-post :chatLog="chatLog" :roomID="$route.params.id" id="log" @onLike="onLike"></user-post>
  <form @submit="onSubmit">
    <label for="username">Username</label>
    <input type="text" name="username" v-model="userName" placeholder="ユーザーネーム">
    <label for="text">Posts</label>
    <textarea v-model="$data.text" name="text" type="text" placeholder="投稿" required @keyup.ctrl.enter="onSubmit"></textarea>
    <button>Send</button>
  </form>
</div>
</template>

<script>
import socket from '../utils/socket';

// components
import UserPost from './UserPost.vue';

const key = 'LOCALSTORAGE_LIKED_KEY';

export default {
  components: {
    'user-post': UserPost,
  },
  data() {
    return {
      userName: '',
      text: '',
      chatLog: [],
      errorMessage: '',
      likedList: [],
      likedlog: []
    };
  },
  created() {
    console.log('chathome is created!');
    this.onConnect();
    this.onSetChatLog();
    this.onSend();
    this.onOtherLiked();
  },
  methods: {
    onConnect() {
      socket.emit('getChatLog', () => {});
      console.log('getting chat log');
      // socket.on('connect', () => {
      //   console.log('connected!');
      //   // チャットログを受け取るためにcreatedでgetChatLogを送信
      //   socket.emit('getChatLog', () => {});
      //   console.log('getting chat log');
      // });
    },

    onSetChatLog() {
      socket.on('setChatLog', (messages) => {
        const vm = this;
        // サーバーからチャットの配列を受け取って追加
        vm.chatLog.push(...messages);
        // localStorageにlikedlistの情報が残っているならそれを格納する
        if (localStorage.getItem(key)) {
          vm.likedList = JSON.parse(localStorage.getItem(key));
          vm.likedList.forEach(function(item) {
            if (vm.chatLog[item.id]) {
              vm.chatLog[item.id].isLiked = item.isLiked;
            }
          });
        }
        console.log(this.chatLog);
      });
    },

    onSend() {
      // 返ってきたメッセージとユーザーネームのobjectを自身のchatLogに代入
      socket.on('send', (object) => {
        this.chatLog.push(object);
      });
    },

    onOtherLiked() {
      socket.on('onLikeSocket', (likedLog) => {
        this.chatLog[likedLog.id].like = likedLog.like;
      });
    },

    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      // textとusernameが空かどうか判定する
      if (this.text && this.$data.userName) {
        this.text = this.text.replace(/\n/g, '<br>');
        socket.emit('send', this.$data.text, this.$data.userName, this.$route.params);
        this.errorMessage = '';
      } else {
        // messageが空欄だった場合にエラーメッセージを表示
        this.errorMessage = '投稿内容、もしくはユーザーネームを入力してください';
      }
      this.text = '';
      setTimeout(this.Scroll, 10);
    },
    /**
     *childcomponent userPostでonLikeChildメソッドが呼ばれた時
     *
     */
    onLike(logId) {
      const vm = this;
      let isUpdated = false;
      console.log(vm.chatLog);

      vm.likedLog = vm.chatLog[logId];
      vm.likedLog.isLiked ? vm.likedLog.like-- : vm.likedLog.like++;
      vm.likedLog.isLiked = !vm.likedLog.isLiked;

      if (vm.likedList.length > 0) {
        vm.likedList.forEach(function(item) {
          if (item.id === logId) {
            item.isLiked = vm.likedLog.isLiked;
            isUpdated = true;
          }
        });
      }

      if (isUpdated === false) {
        vm.likedList.push({ id: logId, isLiked: vm.likedLog.isLiked });
      }
      localStorage.setItem(key, JSON.stringify(vm.likedList));
      socket.emit('like', this.chatLog[logId], this.userName);
      console.log(vm.likedList);
    },

    Scroll() {
      const childList = document.getElementById('chats_list').lastChild;
      if (childList) {
        childList.scrollIntoView(false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

div {
  font-family: '游ゴシック Medium', YuGothic, YuGothicM, 'Hiragino Kaku Gothic ProN', 'Hiragino Kaku Gothic Pro', メイリオ, Meiryo, sans-serif;
}

[v-cloak] {
  display: none;
}

#log {
  height: 75vh;
  width: 80%;
  overflow: auto;
}

// form {
//   position: fixed;
//   bottom: 0;
//   left: 0;
// }
</style>
