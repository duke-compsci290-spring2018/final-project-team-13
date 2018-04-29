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