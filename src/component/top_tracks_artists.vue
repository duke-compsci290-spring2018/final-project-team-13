<template>
  <b-container fluid>

    <h1>
      Top 20 Tracks & Artists
    </h1>

    <div id="options">
      <b-form-select v-show="all_loaded" v-model="time_selected" :options="time_options" placeholder="cool" class="mb-3">
          <option slot="first" :value="null" disabled>Time Period</option>
      </b-form-select>
      <div id="loading" v-show="!all_loaded"><b>Loading...</b></div>
    </div>

    <div v-if="time_selected">
      <h3>Tracks</h3>
      <ul>
        <li class="tracks" v-for="track, index in top_tracks_display.items">
          <h6><a :href="track.external_urls.spotify"> {{ track.name }} </a></h6> <br>
          <img class="track_image"
              :src="track.album.images[1].url"
              v-on:click="playMusic(track.preview_url, index)"
              v-bind:class="{ currently_playing: currently_playing_index == index }"
              v-b-popover.bottom.hover="extractArtists(track.artists) + '\nAlbum: '+track.album.name"
              :title="track.name"/>

        </li>
      </ul>
    </div>
    <hr/>
    <div v-if="artists_ready && time_selected">
      <h3>Artists</h3>
      <ul>
        <li class="artists" v-for="artist in top_artists_display.items">
          <h6><a :href="artist.external_urls.spotify"> {{ artist.name }} </a></h6> <br>
          <img class="artist_image"
              :src="artist.images[1].url"
              v-b-popover.bottom.hover="'Popularity: ' + artist.popularity + '\nFollowers: ' + artist.followers.total + '\n' + extractGenres(artist.genres)"
              :title="artist.name"/>
        </li>
      </ul>
    </div>

  </b-container>
</template>

<script>
import queryString from 'query-string';
import { router, db, users_ref, store } from '../main.js'


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
      top_tracks_short_preview: null,
      top_tracks_medium_preview: null,
      top_tracks_long_preview: null,
      currently_playing: null,
      currently_playing_index: -1,
      time_selected: null,
      time_options: [
          { value: 'short', text: "short term" },
          { value: 'medium', text: "medium term" },
          { value: 'long', text: "long term" }
      ],
      all_loaded: false
    }
  },
  computed: {
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
    playMusic(url, index) {
      // Null check
      if (url) {
        // Check if a song is already playing
        if (this.currently_playing) {

          // If clicked on new song, pause and delete current song and play new one
          if (this.currently_playing.src !== url) {
            this.currently_playing.pause()
            delete this.currently_playing
            var a = new Audio(url)
            this.currently_playing = a
            this.currently_playing.play()
            this.currently_playing_index = index
          }
          // Pause if necessary
          else if (!this.currently_playing.paused) {
            this.currently_playing.pause()
            this.currently_playing_index = -1
          }
          // Otherwise unpause current song
          else {
            this.currently_playing.play()
            this.currently_playing_index = index
          }


        }
        // Play song if nothing else is playing
        else {
          var a = new Audio(url)
          this.currently_playing = a
          this.currently_playing.play()
          this.currently_playing_index = index
        }

      }
    },
    extractArtists(artists) {
      let res = ""
      for (let i = 0; i < artists.length; i++) {
        res += artists[i].name + ", "
      }
      res = res.substring(0, res.length-2)
      if (artists.length == 1) return ("Artist: " + res)
      else return ("Artists: " + res)
    },
    extractGenres(genres) {
      let res = ""
      for (let i = 0; i < genres.length; i++) {
        res += genres[i] + ", "
      }
      res = res.substring(0, res.length-2)
      if (genres.length == 1) return ("Genre: " + res)
      else return ("Genres: " + res)
    },
    async getTopTracksArtists() {
      let access_token = store.state.current_user.access_token

      // top artists in short term
      await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(response => {
        if (response.status == 401) {
          // Most likely 1 hour timeout on access token
          return 401
        }
        else return response.json();
      }).then(data => {
        // Catch 401 Unauthorized error
        if (data == 401) {
          if (process.env.REFRESH_URL) window.location = process.env.REFRESH_URL + store.state.current_user.refresh_token
          // else window.location = "https://motif-backend-server.herokuapp.com/refresh?refresh_token=" + store.state.current_user.refresh_token
          else window.location = "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token
          return
        }

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
          this.top_tracks_short = data;

          let song_ids = ""
          data.items.forEach(item => {
            song_ids += item.id + "%2C"
          })

          song_ids = song_ids.substring(0, song_ids.length-3)

          fetch("https://api.spotify.com/v1/tracks?ids=" + song_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + access_token
              },
          }).then(raw_data => {
              return raw_data.json()
          }).then(data => {
            data.tracks.forEach(track => {
              this.top_tracks_short.items.forEach(ts => {
                if(track.id == ts.id) {
                  ts.preview_url = track.preview_url
                }
              })
            })
          })
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
          this.top_tracks_medium = data;

          let song_ids = ""
          data.items.forEach(item => {
            song_ids += item.id + "%2C"
          })

          song_ids = song_ids.substring(0, song_ids.length-3)

          fetch("https://api.spotify.com/v1/tracks?ids=" + song_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + access_token
              },
          }).then(raw_data => {
              return raw_data.json()
          }).then(data => {
            data.tracks.forEach(track => {
              this.top_tracks_medium.items.forEach(ts => {
                if(track.id == ts.id) {
                  ts.preview_url = track.preview_url
                }
              })
            })
          })
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
          this.top_tracks_long = data;

          let song_ids = ""
          data.items.forEach(item => {
            song_ids += item.id + "%2C"
          })

          song_ids = song_ids.substring(0, song_ids.length-3)

          fetch("https://api.spotify.com/v1/tracks?ids=" + song_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + access_token
              },
          }).then(raw_data => {
              return raw_data.json()
          }).then(data => {
            data.tracks.forEach(track => {
              this.top_tracks_long.items.forEach(ts => {
                if(track.id == ts.id) {
                  ts.preview_url = track.preview_url
                }
              })
            })
          })
      });

      this.all_loaded = true;
    }
  },
  beforeMount() {
    let access_token = store.state.current_user.access_token
    let refresh_token = store.state.current_user.refresh_token

    // check for access token in state
    if (access_token && refresh_token) {
      // console.log("> Using current user access token & refresh token")
      access_token = store.state.current_user.access_token
      refresh_token = store.state.current_user.refresh_token
      this.getTopTracksArtists()
    }
    // if no access token in state, check for access and refresh token in localStorage
    else {
      access_token = localStorage.getItem("access_token")
      refresh_token = localStorage.getItem("refresh_token")

      if (access_token && refresh_token) {
        // Get current user info from firebase by searching for access token and refresh token
        users_ref.once("value").then(function(snapshot) {
          snapshot.forEach(child => {
            if (access_token == child.val().access_token && refresh_token == child.val().refresh_token) {
              store.commit("updateCurrentUser", child.val())
              // console.log("> Updated current user from localStorage!")
            }
          })
        }).then(() => {
          this.getTopTracksArtists()
        })
      }
      else {
        // Last resort, return user to login page
        router.push({ name: "login" })
      }
    }
  }
}

</script>

<style>
#loading {
  text-align: center;
  vertical-align: middle;
}

.tracks {
  text-align: center;
  display: inline-grid;
  margin-right: 50px;
}

.tracks p {
  margin: 0px;
  width: 180px;
}

.tracks h6 a, .artists h6 a {
  color: Black;
}

.tracks h6 a:hover, .artists h6 a:hover {
  color: White;
  background-color: rgba(0, 0, 0, 0.25);
  text-decoration: none;
}

.track_image {
  margin-top: -25px;
  margin-bottom: 25px;
  width: 180px;
  cursor: pointer;
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

.track_image:hover {
  opacity: 0.75;
}

.currently_playing {
  border: 2px solid White;
  box-shadow: 0 0 15px Black;
}
</style>