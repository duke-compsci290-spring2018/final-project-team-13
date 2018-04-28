<template>
  <b-container>
    <h1 v-if="profile">
      Welcome home, {{ profile.display_name }}!
    </h1>

    <div class="logout">
      <router-link v-bind:to="'/'">Logout</router-link>
    </div>

    <div>
      <b-button v-on:click="refreshToken" class="btn-info">Request New Access Token</b-button>
    </div>

    <b-jumbotron bg-variant="success" text-variant="white" border-variant="dark">
      <template slot="header">
        <router-link v-bind:to="'top_tracks_artists'">Top Tracks & Artists</router-link>
      </template>
      <template slot="lead">
        See the tracks and artists that you enjoy the most!
      </template>
    </b-jumbotron>

    <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
      <template slot="header">
        <router-link v-bind:to="'average_audio_features'">Average Audio Features</router-link>
      </template>
      <template slot="lead">
        See statistics about the average features of your most played songs!
      </template>
    </b-jumbotron>

    <b-jumbotron bg-variant="warning" text-variant="white" border-variant="dark">
      <template slot="header">
        <router-link v-bind:to="'similar_artists'">Similar Artists Graph</router-link>
      </template>
      <template slot="lead">
        See how your top artists are connected with a graph visualization!
      </template>
    </b-jumbotron>

    <b-jumbotron bg-variant="dark" text-variant="white" border-variant="dark">
      <template slot="header">
        <router-link v-bind:to="'timeline'">Timeline</router-link>
      </template>
      <template slot="lead">
        See how your music tastes have evolved through time!
      </template>
    </b-jumbotron>

  </b-container>

</template>

<script>
import queryString from 'query-string';
import { router, db, users_ref } from '../main.js'

export default {
  name: 'home',
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
    refreshToken() {
      // TODO: configure REFRESH_URL within Heroku
      window.location = process.env.REFRESH_URL || "http://localhost:8888/refresh?refresh_token=" + localStorage.getItem("refresh_token");
    }
  },
  async beforeMount() {
    // parse the access token from the window
    let parsed = queryString.parse(window.location.search);
    let access_token = parsed.access_token;
    let refresh_token = parsed.refresh_token;

    // redirect user to login if no access_token
    if (!access_token) {
      // if no access token, but current user is still logged in, stay on home



      // redirect to login window in the backend
      window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
    }

    // access Spotify api with access token stored in localStorage
    // use localStorage.getItem("access_token")
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("access_token", access_token);
      // Only override refresh_token if we received a new one
      if (refresh_token !== "undefined") localStorage.setItem("refresh_token", refresh_token);

    } else {
      alert("No localStorage capabilities!");
    }



    // personal info
    await fetch('https://api.spotify.com/v1/me' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        this.profile = data;

        if (typeof(Storage) !== "undefined") {
          localStorage.setItem("user_id", data.id);
        }

        // Update users db in Firebase
        db.ref("/users/" + data.id).once("value").then(function(snapshot) {

          if (!snapshot.val()) {
            // New user
            db.ref("/users/" + data.id).set({
              display_name: data.display_name,
              profile_picture : data.images[0].url,
              role: "user",
              country: data.country,
              product: data.product,
              followers: data.followers.total,
              access_token: access_token,
              refresh_token: refresh_token              
            })

          }
          else {
            console.log("User " + snapshot.val().display_name + " (" + data.id + ") exists already");

          }
        })

    });

  }
}

</script>

<style>
.logout a {
  background-color: Black;
  color: White;
  padding: 3px;
}
</style>
