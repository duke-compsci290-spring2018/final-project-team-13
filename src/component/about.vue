<template>
    <b-container>
      <!-- <img id="brand" src="../assets/motif_logo.png"> -->
      <img id="brand" :src="require('../assets/motif_logo.png')" alt="Motif Logo" />
      <b-card>
        <h5>
          Motif was - and is being - developed by Kevin Cheng and Elbert Wang, two undergraduate students at Duke University, for their final project in <a href="https://www2.cs.duke.edu/courses/compsci290.2/spring18/">CS290: Web Application Development.</a>
        </h5>
      </b-card>
    </b-container>
</template>

<script>
import { router, db, users_ref, store } from '../main.js'

export default {
  name: 'about',
  data () {
    return {

    }
  },
  methods: {

  },
  beforeMount() {
    let access_token = store.state.current_user.access_token
    let refresh_token = store.state.current_user.refresh_token

    if (access_token && refresh_token && access_token !== "undefined" && refresh_token !== "undefined") {
      console.log("> Using current user access token & refresh token")
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
              console.log("> Updated current user from localStorage!")
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
}
</script>

<style>
#brand {
  min-width: 300px;
  width: 30%;
  padding: 20px;
}
</style>