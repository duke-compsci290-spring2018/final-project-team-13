<template>
  <div id="app">

      <b-navbar sticky toggleable="md" type="dark" variant="dark">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand>Motif</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-button v-on:click="readData">Read Data</b-button>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-button v-if="current_user.role == 'guest'" v-on:click="">Register as User</b-button>

            <b-nav-item-dropdown right v-if="current_user.role == 'user' || current_user.role == 'admin'">
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


      <router-view>
      </router-view>

  </div>
</template>

<script>
import queryString from 'query-string'
import Firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: "motif-290.firebaseapp.com",
  databaseURL: "https://motif-290.firebaseio.com",
  projectId: "motif-290",
  storageBucket: "motif-290.appspot.com",
  messagingSenderId: "427568271492"
}
Firebase.initializeApp(config)

const db = Firebase.database()
const users_ref = db.ref("users")

export default {
  name: 'app',
  data () {
    return {
      current_user: {
        spotify_id: "",
        profile_url: "",
        display_name: "",
        role: "anonymous"
      }
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    readData() {
      users_ref.once("value").then(function(snapshot) {
        console.log(snapshot.val())
      });
    }
  },
  mounted() {

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
</style>
