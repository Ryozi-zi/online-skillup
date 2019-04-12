<template lang="html">
  <div id="chats">
    <transition-group name="post" id="chats_list">
      <li v-for="chat in chatLog" :key="chat.id" class="post" v-if="chat.roomID === roomID">
        <div v-html="identicon(chat.username)" class="userimage"></div>
        <div class="texts">
          <p class="username">{{ chat.username }}</p>
          <p class="postedTime">{{ chat.postedTime }}</p>
          <div class="userpost" v-html="chat.text"></div>
          <div class="like">
            <i class="far fa-heart" @click="onLike(chat.id)"><i :class="{ liked : chat.isLiked }" class="fas fa-heart inside"></i></i>
            <span>{{ chat.like }}</span>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
const jdenticon = require('jdenticon');
import { mapGetters } from 'vuex';

export default {
  props: {
    chatLog: Array,
    roomID: Number
  },
  created() {
    if (!this.isLoggedIn) {
      this.redirectHome();
    }
  },
  methods: {
    identicon: (username) => {
      return jdenticon.toSvg(username, 50);
    },

    onLike(id) {
      this.$emit('onLike', id);
    }
  },
  computed: {
    ...mapGetters(['userName']),
  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  border-bottom: 1px solid #eee;
}

i {
  color: #ffb5ee;
  font-size: 1rem;
  position: relative;
  transition: font-size cubic-bezier(0.48, 1.35, 0.6, 1.4) 0.2s;
}

span {
  font-size: 0.8rem;
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
  font-size: 1rem;
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
  font-size: 0.75rem;
  color: #ccc;
}

.username {
  font-size: 1rem;
  color: black;
  display: inline-block;
  margin-right: 10px;
  font-weight: bold;
  margin-bottom: 5px;
}

.userimage {
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  align-items: top;
  justify-content: center;
  width: 40px;
  margin-right: 10px;
}

.userpost {
  font-weight: 100;
  font-size: 0.9rem;
  padding-bottom: 0.5rem;
}

.post-enter-active, .post-leave-active {
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.56, 1.93, 0.78, 1.93);
}

.post-enter, .post-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>
