<template>
  <div id="app">
      <h1> Motif </h1>
      <!-- sign in button -->
      <button type="button" class="btn btn-danger" @click="sign_in">Sign In Baby</button>
      <button type="button" class="btn btn-info" @click="access_api">Pull that Data Baby</button>

      <div v-if="profile">
        <mod1 :myName="profile.display_name"></mod1>
        <img :src="profile.images[0].url" />
        <p>
        Profile URL: <a :href="profile.external_urls.spotify">{{ profile.external_urls.spotify }}</a> <br>
        Country: {{ profile.country }} <br>
        Followers: {{ profile.followers.total }} <br>
        Subscription: {{ profile.product }}
        </p>
      </div>

      <div v-if="top_artists">
        <h3>Top 10 Artists</h3>
        <ul>
          <li v-for="artist in top_artists.items">
            {{ artist.name }} <br>
            <img :src="artist.images[1].url" />
          </li>
        </ul>
      </div>

      <div v-if="top_tracks">
        <h3>Top 10 Tracks</h3>
        <ul>
          <li v-for="track in top_tracks.items">
            {{ track.name }} <br>
            <img :src="track.album.images[1].url" />
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import queryString from 'query-string';
import $ from 'jquery';

export default {
  name: 'app',
  data () {
    return {
        profile: null,
        top_artists: null,
        top_tracks: null
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
          // personal info
          $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                console.log(data)
                  this.profile = data;

              }
          });
          // top artists
          $.ajax({
              url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                  console.log("Top Artists", data);
                  this.top_artists = data;
              }
          });
          // top tracks
          $.ajax({
              url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                  console.log("Top Tracks", data);
                  this.top_tracks = data;
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
