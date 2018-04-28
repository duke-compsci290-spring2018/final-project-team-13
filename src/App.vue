<template>
  <div id="app">

    <b-navbar sticky v-if="current_role !== 'guest'" toggleable="sm" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand id="logo" v-on:click="goHome">Motif</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-button class="btn-outline-success" v-if="" v-on:click="readCurrentUser">Read Current User State</b-button>
          <b-button v-on:click="refreshToken" class="btn-info">Request New Access Token</b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if="current_role == 'user' || current_role == 'admin'">
            <!-- Using button-content slot -->
            <template slot="button-content">
              {{ current_role }}
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
    readCurrentUser() {
      console.log("> Current user: ", store.state.current_user)
    },
    readCurrentRole() {
      console.log("> " + this.current_role)
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
    font-family: 'Josefin Sans', sans-serif;
    text-align: center;
}

#options {
    margin-top: 30px;
    width: 30%;
}

a {
  color: Black;
}

a:hover {
  color: White;
}

#logo:hover {
  cursor: pointer;
}

.tracks {
    text-align: center;
    display: inline-grid;
    margin-right: 50px;
}

.tracks p{
    margin: 0px;
    width: 180px;
}

.track_image {
    margin-top: -25px;
    margin-bottom: 25px;
    width: 180px;
}

.artists {
    text-align: center;
    display: inline-grid;
    margin-right: 50px;
}

.artists p{
    margin: 0px;
    width: 180px;
}

.artist_image {
    margin-top: -25px;
    margin-bottom: 25px;
    width: 180px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
