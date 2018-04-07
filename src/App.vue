<template>
  <div id="app">
      <h1> Motif </h1>
      <!-- sign in button -->
      <button type="button" class="btn btn-danger" @click="sign_in">Sign In Baby</button>
      <button type="button" class="btn btn-info" @click="access_api">Pull that Data Baby</button>
      <mod1 :myName="user_name"></mod1>
  </div>
</template>

<script>
import queryString from 'query-string';
import $ from 'jquery';

export default {
  name: 'app',
  data () {
    return {
        user_name: "",
    }
  },
  methods: {
      sign_in() {
          // redirect to login window in the backend
          window.location = 'http://localhost:8888/login';
      },
      access_api() {
          // parse the access token from the window
          let parsed = queryString.parse(window.location.search);
          let accessToken = parsed.access_token;

          // access Spotify api with access token
          $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                  this.user_name = data.display_name;
                  console.log(this.user_name);
              }
          });
      },
  },
  mounted() {
  }
}
</script>

<style>

</style>
