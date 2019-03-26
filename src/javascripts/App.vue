<template>
  <body>
    <div class="ui fixed inverted menu">
      <div class="ui container">
        <router-link to="/" class="header item">Home</router-link>
        <router-link to="/login" v-if="!isLoggedIn" class="item">Login</router-link>
        <router-link to="/rooms" v-if="isLoggedIn" class="item">Rooms</router-link>
        <router-link to="/createroom" v-if="isLoggedIn" class="item">Create a room</router-link>
        <a @click="logout" v-if="isLoggedIn" class="item">Logout</a>
        <div v-if="userName" class="right menu">
          <div class="item">{{ userName }}</div>
        </div>
      </div>
    </div>
    <div class="ui main text container">
      <router-view></router-view>
    </div>
  </body>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      message: 'this is app vue'
    };
  },
  methods: {
    ...mapActions(['logout']),

    redirectHome() {
      this.$router.push('/');
    }
  },
  created() {
    console.log('created!');
    if (!this.isLoggedIn) {
      this.redirectHome();
    }
  },
  computed: mapGetters(['userName', 'isLoggedIn']),
  watch: {
    isLoggedIn: function() {
      if (!this.isLoggedIn) {
        this.redirectHome();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
}

.main.container {
  margin-top: 3.75em;
}
</style>
