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
import { router, db, users_ref } from './main.js'

export default {
  name: 'app',
  data () {
    return {
      current_user_id: "",
      current_user_role: "anonymous",
      is_logged_in: false
    }
  },
  computed: {
      on_login_page() {

      }
  },
  watch: {
  },
  methods: {
    test() {
        console.log(this.user_id)
    },
    readData() {
      let my_id = "1239569139"
      db.ref("/users/" + my_id).once("value").then(function(snapshot) {
        console.log(snapshot.val())
      })

      // users_ref.once("value").then(function(snapshot) {
      //   snapshot.forEach(user => {
      //       let spotify_id = user.child('spotifyID').val();
      //       if(spotify_id === my_id) {
      //           let role = user.child('role').val();
      //           if(role === 'admin') this.current_user.role = 'admin';
      //           else this.current_user.role = 'user';
      //       }
      //   })
      // });
    }
  },
  updated() {

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
