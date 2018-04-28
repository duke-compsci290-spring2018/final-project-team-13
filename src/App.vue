<template>
  <div id="app">

      <b-navbar sticky toggleable="sm" type="dark" variant="dark">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand>Motif</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-button v-if="" v-on:click="readData">Read User Data</b-button>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-button v-if="current_user_role == 'guest'" v-on:click="">Register as User</b-button>

            <b-nav-item-dropdown right v-if="current_user_role == 'user' || current_user_role == 'admin'">
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>User</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Signout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>

      <transition name="fade">
        <router-view>
        </router-view>
      </transition>

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
