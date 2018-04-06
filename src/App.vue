<template>
  <div id="app">
      <h1> Motif </h1>
      <mod1></mod1>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
      test() {
         d3.select("#app").style("background-color", "red");
      }
  },
  mounted() {
      this.test();
  }
}
</script>

<style>

</style>
