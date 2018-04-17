<template>
  <div id="app">
      <h1> Motif </h1>
      <!-- sign in button -->
      <button type="button" class="btn btn-danger" @click="sign_in">Sign In Baby</button>
      <button type="button" class="btn btn-info" @click="access_api">Pull that Data Baby</button>
      <div id="options">
          <b-form-select v-model="time_selected" :options="time_options" placeholder="cool" class="mb-3">
              <option slot="first" :value="null" disabled>-- Time Period --</option>
          </b-form-select>
          <div>Selected: <strong>{{ time_selected }}</strong></div>
      </div>

      <!-- <div v-if="profile">
        <mod1 :myName="profile.display_name"></mod1>
        <img :src="profile.images[0].url" />
        <p>
        Profile URL: <a :href="profile.external_urls.spotify">{{ profile.external_urls.spotify }}</a> <br>
        Country: {{ profile.country }} <br>
        Followers: {{ profile.followers.total }} <br>
        Subscription: {{ profile.product }}
        </p>
      </div>

      <div v-if="top_artists">
        <h3>Top 10 Artists</h3>
        <ul>
          <li v-for="artist in top_artists.items">
            {{ artist.name }} <br>
            <img :src="artist.images[1].url" />
          </li>
        </ul>
      </div> -->

      <avgfeat v-if="time_selected" :user_selected="time_selected" :audioFeatures_short="top_tracks_short_features" :audioFeatures_medium="top_tracks_medium_features" :audioFeatures_long="top_tracks_long_features"></avgfeat>

      <div v-if="time_selected">
        <h3>Top 10 Tracks</h3>
        <ul>
          <li class="tracks" v-for="track in top_tracks_display.items">
            <p> {{ track.name }} </p> <br>
            <img class="track_image" :src="track.album.images[1].url" />
          </li>
        </ul>
      </div>

  </div>
</template>

<script>
import queryString from 'query-string';
import $ from 'jquery';

export default {
  name: 'app',
  data () {
    return {
        profile: null,
        top_artists: null,
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
  watch: {
      time_selected: function(val) {
          if (val === 'short') this.top_tracks_display = this.top_tracks_short;
          else if (val === 'medium') this.top_tracks_display = this.top_tracks_medium;
          else this.top_tracks_display = this.top_tracks_long;
      },
  },
  methods: {
      sign_in() {
          // redirect to login window in the backend
          window.location = process.env.LOGIN_URL || 'http://localhost:8888/login';
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

          // top artists
        //   await fetch('https://api.spotify.com/v1/me/top/artists?time_range='+ this.time_selected +'&limit=10&offset=0' , {
        //       method: 'GET',
        //       headers: {
        //           'Authorization': 'Bearer ' + accessToken
        //       },
        //   }).then(raw_data => {
        //       return raw_data.json();
        //   }).then(data => {
        //       console.log("Top Track Short", data);
        //       this.top_artists = data;
        //   });

          // top tracks in short term
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0' , {
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
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=0' , {
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
          await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0' , {
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
              track_ids += "2C" + track.id + "%";
          });

          //
          track_ids = track_ids.substring(2, track_ids.length-1);

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

<style >
#options {
    margin-top: 30px;
    width: 30%;
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
</style>
