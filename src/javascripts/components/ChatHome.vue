<template>
<div v-cloak class="container">
  <h1>{{ $route.params.room_name }}</h1>
  <p>{{ $route.params.room_description}}</p>
  <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
  <user-post :chatLog="chatLog" :roomID="$route.params.id" id="log" @onLike="onLike"></user-post>
  <form @submit="onSubmit" class="ui input field posting">
    <textarea v-model="$data.text" name="text" type="text" placeholder="メッセージを入力" rows="1" required @keyup.ctrl.enter="onSubmit" style="border-radius: 0.28571429rem; margin-right: 0.1em;"></textarea>
    <button class="ui button">Send</button>
  </form>
</div>
</template>

<script>
import socket from '../utils/socket';

// components
import UserPost from './UserPost.vue';
import { mapGetters } from 'vuex';

const key = 'LOCALSTORAGE_LIKED_KEY';

export default {
  components: {
    'user-post': UserPost,
  },
  data() {
    return {
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
      // textが空かどうか判定する
      this.text = this.text.trim();
      if (!this.text) {
        this.errorMessage = '投稿内容を入力してください';
        return;
      }

      this.text = this.text.replace(/\n/g, '<br>');
      socket.emit('send', this.$data.text, this.userName, this.$route.params);
      this.errorMessage = '';
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
    },

    Scroll() {
      const childList = document.getElementById('chats_list').lastChild;
      if (childList) {
        childList.scrollIntoView(false);
      }
    }
  },
  computed: {
    ...mapGetters(['userName'])
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
  overflow: auto;
}

.posting {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
