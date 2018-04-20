<template>
    <div id="body">
         <button type="button" class="btn btn-outline-secondary" @click="get_similar">Artists you might like </button>
    </div>
</template>

<script>
import queryString from 'query-string';

export default {
    props: ['user_selected', 'data_short', 'data_medium', 'data_long'],
    mounted() {

    },
    watch: {

    },
    computed: {

    },
    data() {
        return {
            artists_short: this.data_short,
            artists_medium: this.data_medium,
            artists_long: this.data_long,
            lvl1_similar: [],
        }
    },
    methods: {
        async get_similar() {
            let selected_data = this.artists_short;
            // parse the access token from the window

            // selected_data.items.forEach(artist => {
            //     let s_a = this.fetch_data(artist.id);
            // })

            this.fetch_data(selected_data.items[1].id).then(result => {
                console.log(result);
            })

        },
        fetch_data(id) {
            let parsed = queryString.parse(window.location.search);
            var accessToken = parsed.access_token;
            return new Promise((resolve, reject) => {
                fetch('https://api.spotify.com/v1/artists/'+ id +'/related-artists' , {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                }).then(raw_data => {
                    return raw_data.json();
                }).then(data => {
                    console.log("Similar Artists", data);
                    let id_array = [];
                    data.artists.forEach(artist => {
                        id_array.push(artist.id);
                    })
                    resolve(id_array);
                });
            })
        }
    },
}
</script>

<style>
#body {
}
</style>
