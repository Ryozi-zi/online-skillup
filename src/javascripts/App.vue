<template>
<div>
  <p>
    <img class="logo" src="../images/logo.jpg" alt="ロゴ">
    <span class="sample">サンプルコード</span>
  </p>
  <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
  <userPost :chatLog="chatLog" id="log" @onLike="onLike"></userPost>
  <form @submit="onSubmit">
    <label for="name">Username</label>
    <input type="text" name="username" v-model="userName" placeholder="ユーザーネーム">
    <label for="text">Posts</label>
    <textarea v-model="$data.text" name="text" type="text" placeholder="投稿" required @keyup.ctrl.enter="onSubmit"></textarea>
    <button type="submit">送信</button>
  </form>
</div>
</template>

<script>
import socket from './utils/socket';

// components
import MyComponent from './components/MyComponent.vue';
import userPost from './components/userPost.vue';

const key = 'LOCALSTORAGE_LIKED_KEY';

export default {
  components: {
    MyComponent,
    userPost
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
    socket.on('connect', () => {
      console.log('connected!');
      // チャットログを受け取るためにcreatedでgetChatLogを送信
      socket.emit('getChatLog', () => {});
      console.log('getting chat log');
    });

    socket.on('setChatLog', (messages) => {
      const vm = this;
      // サーバーからチャットの配列を受け取って追加
      vm.chatLog.push(...messages);
      console.log(vm.likedList);
      if (localStorage.getItem(key)) {
        vm.likedList = JSON.parse(localStorage.getItem(key));
        vm.likedList.forEach(function(item) {
          if (vm.chatLog[item.id]) {
            vm.chatLog[item.id].isLiked = item.isLiked;
          }
        });
      } else {
        vm.likedList = [];
      }
      console.log(this.chatLog);
    });
    // 返ってきたメッセージとユーザーネームのobjectを自身のchatLogに代入
    socket.on('send', (object) => {
      console.log(object);
      this.chatLog.push(object);
    });

    socket.on('onLikeSocket', (likedLog) => {
      this.chatLog[likedLog.id].like = likedLog.like;
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      // textとusernameが空かどうか判定する
      if (this.text && this.$data.userName) {
        this.text = this.text.replace(/\n/g, '<br>');
        socket.emit('send', this.$data.text, this.$data.userName);
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
.logo {
  width: 40px;
}

#log {
  height: 85vh;
  width: 80%;
  overflow: auto;
}

.sample {
  color: $red;
}

form {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
