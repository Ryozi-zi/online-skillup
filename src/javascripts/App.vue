<template>
  <div>
    <router-link to="/chat">Go to chat</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      message: 'this is app vue'
    };
  },
  created() {
    console.log('created!');
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
}
</style>
