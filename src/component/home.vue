<template>
  <b-container v-show="all_loaded">
    <br/>
    <b-jumbotron class="transparent">
      <template slot="header">
        <router-link v-bind:to="'top_tracks_artists'">Top Tracks & Artists</router-link>
      </template>
      <template slot="lead">
        See the tracks and artists that you enjoy the most!
      </template>
    </b-jumbotron>

    <b-jumbotron class="transparent">
      <template slot="header">
        <router-link v-bind:to="'average_audio_features'">Average Audio Features</router-link>
      </template>
      <template slot="lead">
        See statistics about the average features of your most played songs!
      </template>
    </b-jumbotron>

    <b-jumbotron class="transparent">
      <template slot="header">
        <router-link v-bind:to="'similar_artists'">Similar Artists Graph</router-link>
      </template>
      <template slot="lead">
        See how your top artists are connected with a graph visualization!
      </template>
    </b-jumbotron>

    <b-jumbotron bg-variant="dark" text-variant="white">
      <template slot="header">
        <!-- <router-link v-bind:to="'timeline'">Timeline</router-link> -->
        Timeline
      </template>
      <template slot="lead">
        Currently under development.
      </template>
    </b-jumbotron>
  </b-container>

</template>

<script>
import queryString from 'query-string';
import { router, db, users_ref, store } from '../main.js'
import $ from 'jquery'

export default {
  name: 'home',
  data () {
    return {
      profile: null,
      all_loaded: false
    }
  },

  computed: {

  },

  watch: {

  },

  methods: {
    updateCurrentUser(user) {
      store.commit('updateCurrentUser', user)
    }
  },

  beforeMount() {
    this.all_loaded = false
    // parse the access token from the window
    let parsed = queryString.parse(window.location.search);
    let access_token = parsed.access_token;
    let refresh_token = parsed.refresh_token;

    // if no access token in url
    if (!access_token || access_token == "undefined") {
      // check for access token in state
      access_token = store.state.current_user.access_token
      refresh_token = store.state.current_user.refresh_token

      if (access_token && refresh_token && access_token !== "undefined" && refresh_token !== "undefined") {
        // console.log("> Using current user access token & refresh token")
      }
      // if no access token in state, check for access and refresh token in localStorage
      else {
        access_token = localStorage.getItem("access_token")
        refresh_token = localStorage.getItem("refresh_token")

        if (access_token && refresh_token) {

          // Get current user info from firebase by searching for access token and refresh token
          users_ref.once("value").then(function(snapshot) {
            snapshot.forEach(child => {
              if (access_token == child.val().access_token && refresh_token == child.val().refresh_token) {
                store.commit("updateCurrentUser", child.val())
                // console.log("> Updated current user from localStorage!")
              }
            })
          })
        }
        else {
          // Last resort, return user to login page
          router.push({ name: "login" })
        }
      }
    }

    if (access_token && access_token !== "undefined"){
      // Get updated profile information from Spotify API (only place to update profile info)
      fetch('https://api.spotify.com/v1/me' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(response => {
          if (response.status == 401) {
            // Most likely 1 hour timeout on access token
            return 401
          }
          else return response.json();
      }).then(data => {

        // Catch 401 Unauthorized error
        if (data == 401) {
          if (process.env.REFRESH_URL) window.location = process.env.REFRESH_URL + store.state.current_user.refresh_token
          else window.location = "https://motif-backend-server.herokuapp.com/refresh?refresh_token=" + store.state.current_user.refresh_token
          // else window.location = "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token
          return
        }
        this.profile = data;
        console.log(data)
        // Store access_token and refresh_token token
        if (typeof(Storage) !== "undefined") {
          localStorage.setItem("access_token", access_token)
          if (refresh_token && refresh_token !== "undefined") localStorage.setItem("refresh_token", refresh_token)
        }


        // Update users db in Firebase
        db.ref("/users/" + data.id).once("value").then(function(snapshot) {
          let profile_url = ""
          if (data.images.length > 0) profile_url = data.images[0].url

          if (!snapshot.val()) {
            // New user
            let new_user = {
              spotify_id: data.id,
              display_name: data.display_name,
              profile_picture : profile_url,
              profile_url: data.external_urls.spotify,
              role: "user",
              country: data.country,
              product: data.product,
              followers: data.followers.total,
              access_token: access_token,
              refresh_token: refresh_token,
              background: ""
            }

            db.ref("/users/" + data.id).set(new_user)

            // Update current user for App.vue
            store.commit("updateCurrentUser", new_user)

          }
          else {
            // console.log("> User " + snapshot.val().display_name + " (" + data.id + ") exists; updated profile info");
            // Existing user

            db.ref("/users/" + data.id).update({
              spotify_id: data.id,
              display_name: data.display_name,
              profile_picture : profile_url,
              profile_url: data.external_urls.spotify,
              // Don't update role here
              country: data.country,
              product: data.product,
              followers: data.followers.total,
              access_token: access_token,
              refresh_token: refresh_token,
              // Don't update background here
            })

            // Update current user for App.vue
            store.commit("updateCurrentUser", snapshot.val())

          }
        })

        // Finally, simplify the url by removing query strings
        router.push({ name: "home" })
        this.all_loaded = true
      })
    } //end if
    else {
      // 2nd Last resort, return user to login page
      router.push({ name: "login" })
    }

  },
}

</script>

<style>
.transparent {
  /* #e6e6e6 */
  background: rgba(255, 255, 255, 0.5);
}
</style>
