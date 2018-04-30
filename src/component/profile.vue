<template>
    <b-container v-if="profile">
      <h1 v-if="profile.display_name">{{ profile.display_name }}'s Profile</h1>
      <h1 v-if="!profile.display_name">Your Profile</h1>
      <img id="profile_image" :src="profile.profile_picture" alt="No Profile Picture">
      <ul id="profile_info">
        <li>
          <a class="link" :href="profile.profile_url">Spotify Profile URL</a>
        </li>
        <li>
          <b>Spotify ID:</b> {{ profile.spotify_id }}
        </li>
        <li>
          <b>Country:</b> {{ profile.country }}
        </li>
        <li>
          <b>Followers:</b> {{ profile.followers }}
        </li>
        <li>
          <b>Subscription:</b> {{ profile.product }}
        </li>
        <li>
          <b>Role (Motif):</b> {{ profile.role }}
        </li>
      </ul>
      <br/>
      <b-card border-variant="dark"
              header="Customize Background Color">
        <b-row>
          <b-col>
            <b-button id="gradient_1" v-on:click="changeBG(1)">Gradient 1 (Peach)</b-button>
          </b-col>
          <b-col>
            <b-button id="gradient_2" v-on:click="changeBG(2)">Gradient 2 (Digital Water)</b-button>
          </b-col>
          <b-col>
            <b-button id="default_gray" v-on:click="changeBG(0)">Default Gray</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>Gradients courtesy of <a class="link" href="https://uigradients.com/">uigradients</a></b-col>
        </b-row>
      </b-card>
    </b-container>
</template>

<script>
import { router, db, users_ref, store } from '../main.js'
import $ from 'jquery'

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
    loadProfile() {
      this.profile = store.state.current_user
    },
    changeBG(option) {
      if (option == 1) {
        $("body").css({
          "background": "#ED4264", /* fallback for old browsers */
          "background": "-webkit-linear-gradient(to top, #FFEDBC, #ED4264)", /* Chrome 10-25, Safari 5.1-6 */
          "background": "linear-gradient(to top, #FFEDBC, #ED4264)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          "background-attachment": "fixed"
        })
        db.ref("/users/" + store.state.current_user.spotify_id).update({
          background: 1
        })
      }
      else if (option == 2) {
        $("body").css({
          "background": "#74ebd5", /* fallback for old browsers */
          "background": "-webkit-linear-gradient(to bottom, #ACB6E5, #74ebd5)", /* Chrome 10-25, Safari 5.1-6 */
          "background": "linear-gradient(to bottom, #ACB6E5, #74ebd5)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          "background-attachment": "fixed"
        })
        db.ref("/users/" + store.state.current_user.spotify_id).update({
          background: 2
        })
      }
      else {
        $("body").css("background", "#e6e6e6")
        db.ref("/users/" + store.state.current_user.spotify_id).update({
          background: 0
        })
      }

    }
  },
  beforeMount() {
    let access_token = store.state.current_user.access_token
    let refresh_token = store.state.current_user.refresh_token

    // check for access token in state
    if (access_token && refresh_token) {
      // console.log("> Using current user access token & refresh token")
      access_token = store.state.current_user.access_token
      refresh_token = store.state.current_user.refresh_token
      this.loadProfile()
    }
    // if no access token in state, check for access and refresh token in localStorage
    else {
      access_token = localStorage.getItem("access_token")
      refresh_token = localStorage.getItem("refresh_token")

      if (access_token && refresh_token) {
        // Get current user info from firebase by searching for access token and refresh token
        users_ref.once("value").then(function(snapshot) {
          snapshot.forEach(child => {
            if (child.val().access_token && access_token == child.val().access_token && child.val().refresh_token && refresh_token == child.val().refresh_token) {
              store.commit("updateCurrentUser", child.val())
              // console.log("> Updated current user from localStorage!")
            }
          })
        }).then(() => {
          this.loadProfile()
        })
      }
      else {
        // Last resort, return user to login page
        router.push({ name: "login" })
      }
    }
  }
}
</script>

<style>
#profile_image {
  max-width: 150px;
  max-height: 150px;
  border: 3px solid Black;
  border-radius: 10%;
}
#profile_info {
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}
.link {
  color: Black;
  text-decoration: underline;
}
.link:hover {
  color: White;
  background-color: rgba(0, 0, 0, 0.3);
}

#gradient_1 {
  background: #ED4264;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #FFEDBC, #ED4264);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #FFEDBC, #ED4264); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: Black;
}

#gradient_2 {
  background: #74ebd5;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #ACB6E5, #74ebd5);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: Black;
}

#default_gray {
  background: #e6e6e6;
  color: Black;
}

</style>