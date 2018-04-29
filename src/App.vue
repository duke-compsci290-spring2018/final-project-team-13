<template>
  <div id="app">

    <b-navbar sticky v-if="current_role !== 'guest'" toggleable="sm" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand v-on:click="goHome"><img id="logo" src="./assets/motif_logo.png"></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-button v-on:click="refreshToken" class="btn-info">Request New Access Token</b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <img id="profile_picture" :src="profile_picture">
          <b-nav-item-dropdown right v-if="current_role == 'user' || current_role == 'admin'">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <i class="fas fa-cog"></i>
            </template>
            <b-dropdown-item v-if="current_role == 'admin'" v-on:click="goAdmin">Admin Page</b-dropdown-item>
            <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <router-view>
    </router-view>

  </div>
</template>

<script>
import queryString from 'query-string'
import * as Router from 'vue-router'
import { router, db, users_ref, store } from './main.js'

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
        refresh_token: ""
      })
      // Delete access_token and refresh_token from localStorage
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")

      // Take user back to login page
      router.push({ name: 'login'})
    },
    refreshToken() {
      // TODO: configure REFRESH_URL within Heroku
      window.location = process.env.REFRESH_URL || "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token;
    }
  },
  created() {
    db.ref("/users/" + store.state.current_user.spotify_id).on("child_changed", function(snapshot) {
      store.state.current_user.role = snapshot.val().role
    });
  }
}
</script>

<style>
#app {
    font-family: 'Avenir', sans-serif;
    text-align: center;
}



a {
  color: Black;
}

a:hover {
  color: White;
}

#logo{
  max-width: 100px;
  max-height: 40px;
  opacity: 0.85;
}

#logo:hover {
  cursor: pointer;
  opacity: 1;
}

#profile_picture {
  max-width: 40px;
  max-height: 40px;
  border: 2px solid White;
  border-radius: 15%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
