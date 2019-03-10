<template lang="html">
  <ul id="chats">
    <transition-group name="post" id="chats_list">
      <li v-for="chat in chatLog" :key="chat.id" class="post">
        <div v-html="identicon(chat.username)" class="userimage"></div>
        <div class="texts">
          <p class="username">{{ chat.username }}</p>
          <p class="postedTime">{{ chat.postedTime }}</p>
          <p class="userpost" v-html="chat.text"></p>
          <div class="like">
            <i class="far fa-heart" @click="onLike(chat.id)"><i :class="{ liked : chat.isLiked }" class="fas fa-heart inside"></i></i>
            <span>{{ chat.like }}</span>
          </div>
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
  }
  // いいね機能の追加によって廃止
  // updated() {
  //   // v-forがアップデートされた時にメッセージに合わせる
  //   const childList = document.getElementById('chats_list').lastChild;
  //   if (childList) {
  //     childList.scrollIntoView(false);
  //   }
  // }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  border-bottom: 1px solid #eee;
}

i {
  color: #ffb5ee;
  font-size: 2rem;
  position: relative;
  transition: font-size cubic-bezier(0.48, 1.35, 0.6, 1.4) 0.2s;
}

.inside {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0;
  color: #ffb5ee;
}

.liked {
  font-size: 2rem;
}

.like {
  vertical-align: center;
}

.post {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  width: 90%;
  padding: 5px 0 5px 0;
}

.postedTime {
  display: inline;
  font-size: 1.5rem;
  color: #ccc;
}

.username {
  font-size: 1.6rem;
  color: black;
  display: inline-block;
  margin-right: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.userimage {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  align-items: top;
  justify-content: center;
  width: 80px;
}

.userpost {
  font-weight: 100;
  font-size: 1.5rem;
}

.post-enter-active, .post-leave-active {
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.56, 1.93, 0.78, 1.93);
}

.post-enter, .post-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>
