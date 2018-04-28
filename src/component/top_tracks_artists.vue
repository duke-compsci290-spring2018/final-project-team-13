<template>
  <div>

    <h2>
      Top 20 Tracks & Artists
    </h2>

    <b-container id="options">
      <b-row>

         <b-form-select v-model="time_selected" :options="time_options" placeholder="cool" class="mb-3">
             <option slot="first" :value="null" disabled>-- Time Period --</option>
         </b-form-select>
         <b-form-input type="number">

         </b-form-input>
       </b-row>
    </b-container>

    <div v-if="time_selected">
      <h3>Top 20 Tracks</h3>
      <ul>
        <li class="tracks" v-for="track in top_tracks_display.items">
          <p> {{ track.name }} </p> <br>
          <img class="track_image" :src="track.album.images[1].url" />
        </li>
      </ul>
    </div>

    <div v-if="artists_ready && time_selected">
      <h3>Top 20 Artists</h3>
      <ul>
        <li class="artists" v-for="artist in top_artists_display.items">
          <p> {{ artist.name }} </p> <br>
          <img class="artist_image" :src="artist.images[1].url" />
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import queryString from 'query-string';

export default {
  name: 'top_tracks_artists',
  data () {
    return {
      top_artists_display: null,
      top_artists_short: null,
      top_artists_medium: null,
      top_artists_long: null,
      top_tracks_display: null,
      top_tracks_short: null,
      top_tracks_medium: null,
      top_tracks_long: null,
      time_selected: null,
      time_options: [
          { value: 'short', text: "short term" },
          { value: 'medium', text: "medium term" },
          { value: 'long', text: "long term" }
      ]
    }
  },
  computed: {
    // if all the features are loaded
    feat_ready: function() {
        return this.top_tracks_short_features && this.top_tracks_medium_features && this.top_tracks_long_features;
    },
    artists_ready: function() {
        return this.top_artists_short && this.top_tracks_medium && this.top_tracks_long;
    }
  },
  watch: {
    time_selected: function(val) {
        if (val === 'short') {
            this.top_tracks_display = this.top_tracks_short;
            this.top_artists_display = this.top_artists_short;
        }
        else if (val === 'medium') {
            this.top_tracks_display = this.top_tracks_medium;
            this.top_artists_display = this.top_artists_medium;
        }
        else {
            this.top_tracks_display = this.top_tracks_long;
            this.top_artists_display = this.top_artists_long;
        }
    }
  },
  methods: {

  },
  async beforeMount() {
    // retrieve access token from localStorage
    var access_token = localStorage.getItem("access_token");

    // redirect user to login if no access_token
    if (!access_token) {
      // redirect to login window in the backend
      window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
    }

    // top artists in short term
    await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Artists Short", data);
        this.top_artists_short = data;
    });

    // top artists in medium term
    await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Artists Medium", data);
        this.top_artists_medium = data;
    });

    // top artists in long term
    await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Artists Long", data);
        this.top_artists_long = data;
    });

    // top tracks in short term
    await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Tracks Short", data);
        this.top_tracks_short = data;
    });

    // top tracks in medium term
    await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Tracks Medium", data);
        this.top_tracks_medium = data;
    });

    // top tracks in long term
    await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20&offset=0' , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }).then(raw_data => {
        return raw_data.json();
    }).then(data => {
        console.log("Top Tracks Long", data);
        this.top_tracks_long = data;
    });
  }
}

</script>

<style>
</style>