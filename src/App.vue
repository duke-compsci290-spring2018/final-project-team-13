<template>
  <div id="app">

    <b-navbar sticky v-if="current_role !== 'guest'" toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <!-- <b-navbar-brand v-on:click="goHome"><img id="logo" src="./assets/motif_logo.png" alt="Motif Logo"></b-navbar-brand> -->
      <b-navbar-brand v-on:click="goHome"><img id="logo" :src="require('./assets/motif_logo.png')" alt="Motif Logo" draggable=false /></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div>
            <img id="profile_picture" :src="profile_picture" alt="NoPic">
          </div>
          <b-nav-item-dropdown right v-if="current_role == 'user' || current_role == 'admin'">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <i class="fas fa-cog"></i>
            </template>
            <b-dropdown-item id="admin" v-if="current_role == 'admin'" v-on:click="goAdmin">👑Admin Page</b-dropdown-item>
            <b-dropdown-item v-on:click="goProfile">My Profile</b-dropdown-item>
            <b-dropdown-item v-on:click="refreshToken">Refresh Access Token</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item v-on:click="logout"><b>Logout</b></b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <router-view>
    </router-view>

    <div id="about">
      <router-link v-bind:to="'about'">About Motif</router-link>
    </div>
  </div>
</template>

<script>
import queryString from 'query-string'
import * as Router from 'vue-router'
import { router, db, users_ref, store } from './main.js'
import $ from 'jquery'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  computed: {
      current_role() {
        return store.state.current_user.role
      },
      profile_picture() {
        return store.state.current_user.profile_picture
      }
  },
  watch: {
    current_role(role) {
      store.commit("updateCurrentRole", role)
    }
  },
  methods: {
    goHome() {
      router.push({ name: "home" })
    },
    goAdmin() {
      router.push({ name: "admin" })
    },
    goProfile() {
      router.push({ name: "profile" })
    },
    logout() {
      // Reset current user state
      store.commit("updateCurrentUser", {
        spotify_id: "",
        display_name: "Guest",
        profile_picture : "",
        role: "guest",
        country: "",
        product: "",
        followers: "",
        access_token: "",
        refresh_token: "",
        background: 0
      })
      // Delete access_token and refresh_token from localStorage
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")

      // Take user back to login page
      router.push({ name: 'login'})
    },
    refreshToken() {
      if (process.env.REFRESH_URL) window.location = process.env.REFRESH_URL + store.state.current_user.refresh_token
      else window.location = "https://motif-backend-server.herokuapp.com/refresh?refresh_token=" + store.state.current_user.refresh_token
      // else window.location = "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token
    },
    updateBG() {
      let bg = store.state.current_user.background

      if (bg == 1) {
        $("body").css({
          "background": "#ED4264", /* fallback for old browsers */
          "background": "-webkit-linear-gradient(to top, #FFEDBC, #ED4264)", /* Chrome 10-25, Safari 5.1-6 */
          "background": "linear-gradient(to top, #FFEDBC, #ED4264)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          "background-attachment": "fixed"
        })
      }
      else if (bg == 2) {
        $("body").css({
          "background": "#74ebd5", /* fallback for old browsers */
          "background": "-webkit-linear-gradient(to bottom, #ACB6E5, #74ebd5)", /* Chrome 10-25, Safari 5.1-6 */
          "background": "linear-gradient(to bottom, #ACB6E5, #74ebd5)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          "background-attachment": "fixed"
        });
      }
      else {
        $("body").css({
          "background": "#e6e6e6"
        });
      }

    }
  },
  created() {
    db.ref("/users/" + store.state.current_user.spotify_id).on("child_changed", function(snapshot) {
      store.state.current_user.role = snapshot.val().role
      store.state.current_user.background = snapshot.val().background
    })
  },
  updated() {
    this.updateBG()
  }
}
</script>

<style>
html {
  height: 100%;
}
body {
  min-height: 100%;
}
#app {
    font-family: 'Avenir', sans-serif;
    text-align: center;
}

b-navbar {
  background-color: rgba(255, 255, 255, 0.75);
}

.jumbotron h1 a {
  color: Black;
}

.jumbotron h1 a:hover {
  color: Black;
  background-color: rgba(0, 0, 0, 0.3);
  text-decoration: none;
}

#logo{
  max-width: 100px;
  max-height: 40px;
  opacity: 0.75;
  transition: all .1s ease-in-out;
}

#logo:hover {
  cursor: pointer;
  opacity: 1;
  transform: scale(1.1);
}

#profile_picture {
  max-width: 40px;
  max-height: 40px;
  border: 1px solid Black;
  border-radius: 50%;
  display: inline;
}

#admin {
  background-color: Black;
  color: White;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#about {
  position: fixed;
  bottom: 0%;
  left: 5px;
}
#about a {
  color: Black;
}
</style>
