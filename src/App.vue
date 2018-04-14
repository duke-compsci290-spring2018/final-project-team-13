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

      <div v-if="top_tracks">
        <h3>Top 10 Tracks</h3>
        <ul>
          <li class="tracks" v-for="track in top_tracks.items">
            <p> {{ track.name }} </p> <br>
            <img class="track_image" :src="track.album.images[1].url" />
          </li>
        </ul>
      </div>

      <avgfeat v-if="top_tracks_features" :audioFeatures="top_tracks_features"></avgfeat>
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
        top_tracks: null,
        top_tracks_features: null,
        time_selected: null,
        time_options: [
            { value: 'short_term', text: "short term" },
            { value: 'medium_term', text: "medium term" },
            { value: 'long_term', text: "long term" }
        ]
    }
  },
  methods: {
      sign_in() {
          // redirect to login window in the backend
          window.location = 'http://localhost:8888/login';
      },
      async access_api() {
          // parse the access token from the window
          let parsed = queryString.parse(window.location.search);
          let accessToken = parsed.access_token;

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
          await $.ajax({
              url: 'https://api.spotify.com/v1/me/top/artists?time_range='+ this.time_selected +'&limit=10&offset=0',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                  console.log("Top Artists", data);
                  this.top_artists = data;
              }
          });
          // top tracks
          await $.ajax({
              url: 'https://api.spotify.com/v1/me/top/tracks?time_range=' + 'medium_term' + '&limit=10&offset=0',
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              success: data => {
                  console.log("Top Tracks", data);
                  this.top_tracks = data;
              }
          });

         let track_ids = "";

         // save the ids of top tracks into a string
         this.top_tracks.items.forEach(track => {
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
             console.log("Features", data);
             this.top_tracks_features = data;
         });
      },
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
