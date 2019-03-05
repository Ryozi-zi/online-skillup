<template lang="html">
  <ul id="chats">
    <transition-group name="post" id="chats_list">
      <li v-for="chat in chatLog" :key="chat.id" class="post">
        <div v-html="identicon(chat.username)" class="userimage"></div>
        <div class="texts">
          <p class="username">{{ chat.username }}</p>
          <p class="postedTime">{{ chat.postedTime }}</p>
          <p class="userpost" v-html="chat.text"></p>
          <button @click="onLike(chat.id)">like</button>
          <p>{{ chat.like }}</p>
        </div>
      </li>
    </transition-group>
  </ul>
</template>

<script>
const jdenticon = require('jdenticon');

export default {
  props: {
    chatLog: Array
  },
  methods: {
    identicon: (username) => {
      return jdenticon.toSvg(username, 50);
    },

    onLike(id) {
      this.$emit('onLike', id);
    }
  },
  updated() {
    // v-forがアップデートされた時にメッセージに合わせる
    const childList = document.getElementById('chats_list').lastChild;
    if (childList) {
      childList.scrollIntoView(false);
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  border-bottom: 1px solid #eee;
}

.post {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  width: 80%;
}

.postedTime {
  display: inline;
  font-size: 0.8rem;
  color: #ccc;
}

.username {
  font-size: 0.8rem;
  color: green;
  display: inline;
  margin-right: 15px;
}

.userimage {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
}

.userpost {
  font-weight: 200;
}

.post-enter-active, .post-leave-active {
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.55, 0.73, 0.69, 1.25);
}

.post-enter, .post-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>
