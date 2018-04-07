<template>
    <div>
        <h2> Hello {{user_name}}! </h2>
        <input type="button" @click="test1">  </input>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
    props: ['myName'],
    watch: {
        myName: function(newVal, oldVal) {
            this.user_name = this.myName;
        }
    },
    data() {
        return {
            user_name: "",
        }
    },
    methods: {
        test1() {
            d3.select("h2").style("color", "blue");
        }
    },
}
</script>
