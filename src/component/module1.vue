<template>
    <div>
        <h2> Hello {{user_name}}! </h2>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
    props: ['myName'],
    watch: {

    },
    computed: {

    },
    data() {
        return {
            user_name: this.myName,
        }
    },
    methods: {

    },
}
</script>
