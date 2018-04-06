<template>
    <div>
        <h2> Hello! </h2>
        <input type="button" @click="test1">  </input>
    </div>
</template>

<script>
import * as d3 from "d3";

    export default {
        methods: {
            test1() {
                d3.select("h2").style("color", "blue");
            }
        },
    }
</script>
