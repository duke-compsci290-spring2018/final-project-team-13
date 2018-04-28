<template>
  <b-container>
    <button type="button" class="btn btn-outline-success" @click="sign_in">Log In With Spotify</button>
  </b-container>
</template>

<script>
import queryString from 'query-string';

export default {
  name: 'login',
  data () {
    return {
        profile: null
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
      sign_in() {
          // redirect to login window in the backend
          window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
        //   'https://motif-back-end.herokuapp.com/login';
      }
  },
  mounted() {
  }
}
</script>

<style>
</style>