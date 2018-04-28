<template>
  <div id="app">
      <h1> Motif </h1>

      <router-view>
      </router-view>

  </div>
</template>

<script>
import queryString from 'query-string';

export default {
  name: 'app',
  data () {
    return {
        profile: null,
        top_artists_display: null,
        top_artists_short: null,
        top_artists_medium: null,
        top_artists_long: null,
        top_tracks_display: null,
        top_tracks_short: null,
        top_tracks_medium: null,
        top_tracks_long: null,
        top_tracks_short_features: null,
        top_tracks_medium_features: null,
        top_tracks_long_features: null,
        time_selected: null,
        time_options: [
            { value: 'short', text: "short term" },
            { value: 'medium', text: "medium term" },
            { value: 'long', text: "long term" }
        ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
      sign_in() {
          // redirect to login window in the backend
          window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
        //   'https://motif-back-end.herokuapp.com/login';
      },
      async access_api() {
          // parse the access token from the window
          let parsed = queryString.parse(window.location.search);
          var accessToken = parsed.access_token;

          // access Spotify api with access token
          // personal info
          await fetch('https://api.spotify.com/v1/me' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Profile", data);
              this.profile = data;
          });

          // top artists in short term
          await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Short", data);
              this.top_artists_short = data;
          });

          // top artists in medium term
          await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Short", data);
              this.top_artists_medium = data;
          });

          // top artists in long term
          await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Short", data);
              this.top_artists_long = data;
          });

          // top tracks in short term
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Short", data);
              this.top_tracks_short = data;
          });

          // top tracks in medium term
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Mid", data);
              this.top_tracks_medium = data;
          });

          // top tracks in long term
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20&offset=0' , {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              console.log("Top Track Long", data);
              this.top_tracks_long = data;
          });


          this.get_features('short');
          this.get_features('mid');
          this.get_features('long');
      },
      async get_features(term) {
          // parse the access token from the window
          let parsed = queryString.parse(window.location.search);
          var accessToken = parsed.access_token;

          let tracks_data = null;
          let features_data = null
          if (term === "short") {
              tracks_data = this.top_tracks_short;
          } else if (term === "mid") {
              tracks_data = this.top_tracks_medium;
          } else {
              tracks_data = this.top_tracks_long;
          }

          let track_ids = "";

          // save the ids of top tracks into a string
          tracks_data.items.forEach(track => {
              track_ids += track.id + "%2C";
          });

          //
          track_ids = track_ids.substring(0, track_ids.length-3);

          // get the audio features of top tracks
          await fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              if (term === "short") {
                  this.top_tracks_short_features = data;
                  console.log(this.top_tracks_short_features);
              } else if (term === "mid") {
                  this.top_tracks_medium_features = data;
                  console.log(this.top_tracks_medium_features);
              } else {
                  this.top_tracks_long_features = data;
                  console.log(this.top_tracks_long_features);
              }
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
