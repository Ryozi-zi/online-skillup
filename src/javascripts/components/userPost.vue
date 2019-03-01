<template lang="html">
  <ul id="chats">
    <li v-for="chat in chatLog">
      <h2>{{ chat.username }}</h2>
      <p> {{ chat.text }}</p>
      <div v-html="identicon(chat.username)"></div>
    </li>
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
  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
</style>
