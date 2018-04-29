<template>
  <b-container fluid>
    <h3>Average Audio Features of Your Top 20 Tracks</h3>

    <div id="load" v-show="features_loaded">
     <b-button class="btn-success" v-on:click="drawGraph">Load graph</b-button>
    </div>
    <div id="loading" v-show="!features_loaded"><b>Loading...</b></div>

    <b-row id="graph_list_wrapper">
        <div id="chart-container">
            <canvas id="myChart"></canvas>
        </div>
    </b-row>

    <b-row>
      <b-col id="list">
        <b-row id="options" v-if="graph_loaded">
           <b-form-select v-model="time_selected" :options="time_options" class="mb-3">
           </b-form-select>
        </b-row>

         <b-card-group columns id="feature_cards" v-if="avg_features != null">
           <b-card v-for="feat, index in avg_features[dataset_index]"
                  :key="index"
                  :title="feat.type"
                  :sub-title="feat.point">
                <p class="card-text">
                  {{ feat.desc }}
                </p>
            </b-card>

          </b-card-group>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { router, db, users_ref, store } from '../main.js'

export default {
  name: "average_audio_features",
  data() {
      return {
        graph_loaded: false,
        features_loaded: false,
        time_selected: "short",
        time_options: [
            { value: 'short', text: "short term" },
            { value: 'medium', text: "medium term" },
            { value: 'long', text: "long term" }
        ],
        features_short: null,
        features_medium: null,
        features_long: null,

        avg_features: null,
        dataset_index: 0
      }
  },
  watch: {

  },
  async beforeMount() {
    let access_token = store.state.current_user.access_token
    let refresh_token = store.state.current_user.refresh_token

    // check for access token in state
    if (access_token && refresh_token) {
      // console.log("> Using current user access token & refresh token")
      access_token = store.state.current_user.access_token
      refresh_token = store.state.current_user.refresh_token
      this.getFeatures()
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
          this.getFeatures()
        })
      }
      else {
        // Last resort, return user to login page
        router.push({ name: "login" })
      }
    }
  },
  watch: {
      time_selected: function(val) {
          if (val === 'short') {
              this.dataset_index = 0
          }
          else if (val === 'medium') {
              this.dataset_index = 1
          }
          else {
              this.dataset_index = 2
          }
      }
  },
  methods: {
    async getFeatures() {
      // retrieve access token from localStorage
      var access_token = store.state.current_user.access_token

      // top tracks in short term
      await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(response => {
        if (response.status == 401) {
          // Most likely 1 hour timeout on access token
          return 401
        }
        else return response.json()
      }).then(data => {
          // Catch 401 Unauthorized error
          if (data == 401) {
            if (process.env.REFRESH_URL) window.location = process.env.REFRESH_URL + store.state.current_user.refresh_token
            // else window.location = "https://motif-backend-server.herokuapp.com/refresh?refresh_token=" + store.state.current_user.refresh_token
            else window.location = "https://testserver290.herokuapp.com/refresh?refresh_token=" + store.state.current_user.refresh_token
            // else window.location = "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token
            return
          }

          let track_ids = ""
          data.items.forEach(track => {
              track_ids += track.id + "%2C"
          })
          track_ids = track_ids.substring(0, track_ids.length-3)

          // get audio features
          fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + access_token
              },
          }).then(raw_data => {
              return raw_data.json()
          }).then(data => {
              this.features_short = data
          })
      })

      // top tracks in medium term
      await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(raw_data => {
          return raw_data.json()
      }).then(data => {
        let track_ids = ""
        data.items.forEach(track => {
            track_ids += track.id + "%2C"
        })
        track_ids = track_ids.substring(0, track_ids.length-3)

        // get audio features
        fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(raw_data => {
            return raw_data.json()
        }).then(data => {
            this.features_medium = data
        })
      })

      // top tracks in long term
      await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(raw_data => {
          return raw_data.json()
      }).then(data => {
        let track_ids = ""
        data.items.forEach(track => {
            track_ids += track.id + "%2C"
        })
        track_ids = track_ids.substring(0, track_ids.length-3)

        // get audio features
        fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(raw_data => {
            return raw_data.json()
        }).then(data => {
            this.features_long = data
            this.features_loaded = true
        })
      })

    },
    analyzeFeatures(input) {
        let features = null
        if(input === "short") features = this.features_short
        else if(input === "medium") features = this.features_medium
        else features = this.features_long

        let num_tracks = 0

        let avg_feat = [
            {point: 0, type: 'danceability', desc: "Danceability is a measure of tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 1 is most danceable."},
            {point: 0, type: 'energy', desc: "Energy is a measure of dynamic range, perceived loudness, timbre, onset rate, and general entropy. A value of 0 is low energy and 1 is high energy."},
            // {point: 0, type: 'loudness', desc: ""},
            {point: 0, type: 'speechiness', desc: "Speechiness detects the presence of spoken words in a track. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks."},
            {point: 0, type: 'acousticness', desc: "A confidence measure from 0 to 1 of whether the track is acoustic. 1 represents high confidence the track is acoustic."},
            {point: 0, type: 'instrumentalness', desc: "Predicts whether a track contains no vocals. The closer the instrumentalness value is to 1, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1."},
            {point: 0, type: 'valence', desc: "A measure from 0 to 1 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."}
            // {point: 0, type: 'tempo', desc: "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."}
        ]

        features.audio_features.forEach(track => {
          // find sum of all audio features
          avg_feat.forEach(feat => {
            // if (feat.type == "loudness") {
            //   feat.point -= track[feat.type]
            // }
            // else {
            //   feat.point += track[feat.type]
            // }
            feat.point += track[feat.type]
          })
          num_tracks ++
        })

        // get average values and scale them if necessary
        avg_feat.forEach(feat => {
          // if (feat.type == "loudness") {
          //   feat.point = (feat.point/num_tracks).toFixed(1)
          // }
          // else if (feat.type == "tempo") {
          //   feat.point = ((feat.point/num_tracks)/24).toFixed(1)
          // }

          feat.point = (feat.point/num_tracks).toFixed(3)
        })

        return avg_feat
    },
    packData() {
        let short = this.analyzeFeatures("short")
        let medium = this.analyzeFeatures("medium")
        let long = this.analyzeFeatures("long")
        this.avg_features = [short, medium, long]
    },
    drawGraph() {
      this.graph_loaded = true
      this.packData()

      var ctx = document.getElementById('myChart').getContext("2d")
      // labels for the charts: what type of feature
      let label_data = this.avg_features[0].map(data => {return data.type})
      // datasets for the charts
      let short_data = this.avg_features[0].map(data => {return data.point})
      let medium_data = this.avg_features[1].map(data => {return data.point})
      let long_data = this.avg_features[2].map(data => {return data.point})
      // common config
      let tension = 0
      let bWidth = 2
      let bJoinStyle = 'round'
      let pStyle = 'rectRounded'
      let pRadius = 4
      let pHoverRadius = 6
      let pHoverBorderWidth = 10
      // config for gradient
      let x = 600
      let y = 250
      let alpha = 0.25
      // gradient
      var gradientStroke1 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientStroke1.addColorStop(0, '#80b6f4')
      gradientStroke1.addColorStop(1, '#d97171')
      var gradientFill1 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientFill1.addColorStop(0, "rgba(128, 182, 244, "+ alpha +")")
      gradientFill1.addColorStop(1, "rgba(244, 144, 128, "+ alpha +")")
      var gradientStroke2 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientStroke2.addColorStop(0, '#bce784')
      gradientStroke2.addColorStop(1, '#348aa7')
      var gradientFill2 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientFill2.addColorStop(0, "rgba(188, 231, 132, "+ alpha +")")
      gradientFill2.addColorStop(1, "rgba(52, 138, 167, "+ alpha +")")
      var gradientStroke3 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientStroke3.addColorStop(0, '#a8dadc')
      gradientStroke3.addColorStop(1, '#1d3557')
      var gradientFill3 = ctx.createRadialGradient(x, y, 0, x, y, 200)
      gradientFill3.addColorStop(0, "rgba(168, 218, 220, "+ alpha +")")
      gradientFill3.addColorStop(1, "rgba(29, 53, 87, "+ alpha +")")
      // data sets:
      let dataset1 = {
          label: "short term",
          data: short_data,
          backgroundColor: gradientFill1,
          // "rgba(93, 211, 158, 0.2)",
          lineTension: tension,
          borderColor: gradientStroke1,
          // "rgba(93, 211, 158, 0.8)",
          borderWidth: bWidth,
          borderJoinStyle: bJoinStyle,
          pointStyle: pStyle,
          pointRadius: pRadius,
          pointBackgroundColor: gradientFill1,
          pointBorderColor: gradientStroke1,
          pointHoverRadius: pHoverRadius,
          pointHoverWidth: pHoverBorderWidth,
          pointHoverBackgroundColor:gradientFill1,
          pointHoverBorderColor:gradientStroke1,
      }
      let dataset2 = {
          label: "medium term",
          data: medium_data,
          backgroundColor: gradientFill2,
          lineTension: tension,
          borderColor: gradientStroke2,
          borderWidth: bWidth,
          borderJoinStyle: bJoinStyle,
          pointStyle: pStyle,
          pointRadius: pRadius,
          pointBackgroundColor: gradientFill2,
          pointBorderColor: gradientStroke2,
          pointHoverRadius: pHoverRadius,
          pointHoverWidth: pHoverBorderWidth,
          pointHoverBackgroundColor:gradientFill2,
          pointHoverBorderColor:gradientStroke2,
      }
      let dataset3 = {
          label: "long term",
          data: long_data,
          backgroundColor: gradientFill3,
          lineTension: tension,
          borderColor: gradientStroke3,
          borderWidth: bWidth,
          borderJoinStyle: bJoinStyle,
          pointStyle: pStyle,
          pointRadius: pRadius,
          pointBackgroundColor: gradientFill3,
          pointBorderColor: gradientStroke3,
          pointHoverRadius: pHoverRadius,
          pointHoverWidth: pHoverBorderWidth,
          pointHoverBackgroundColor:gradientFill3,
          pointHoverBorderColor:gradientStroke3,
      }
      let datasetCollection = [dataset1, dataset2, dataset3]

      var myRadarChart = new Chart(ctx, {
          type: 'radar',
          data: {
              labels: label_data,
              datasets: [{label: "placeholder"}],
          },
          options: {
              responsive: true,
              scale: {
                  ticks: {
                      beginAtZero: true,
                      min: 0,
                      max: 1,
                      stepSize: 0.2,
                  },
                  pointLabels: {
                      fontSize: 14,
                  }
              },
              legend: {
                  position: 'bottom',
                  labels: {
                      fontSize: 18,
                  }
              },
              animation: {
                  duration: 1000,
                  easing: 'linear',
              }
          }
      })

      function intervalWrapper() {
          let index = 1
          // immediately add the first dataset
          myRadarChart.data.datasets[0] = datasetCollection[0]
          myRadarChart.update()
          // then add the rest of the datasets
          var addData = setInterval(function() {
              if(index < datasetCollection.length) {
                  myRadarChart.data.datasets[index] = datasetCollection[index]
                  myRadarChart.update()
              } else {
                  clearInterval(addData)
              }
              index++
          }, 1000)
      }

      intervalWrapper()
    }
  }
}
</script>

<style>
#body {
    padding-top:10px;
}

#chart-container {
  position: relative;
  margin: 0;
  padding: 0;
  left: 10%;
  width: 80%;
}

#myChart {
  min-width: 10%;
  min-height: 10%;
}

#options_wrapper {
    margin: 0 auto;
    width: 80%;
}

#options {
    width: 60%;
    margin: 0 auto;
    display: table;
}

#options_wrapper #load {
    margin: 0 auto;
    float: left;
}

#graph_list_wrapper {
  margin-top: 20px;
  vertical-align: middle;
}

#list {
  text-align: left;
  padding-top: 50px;
  padding-left: 0px;
}

#list ul{
  list-style: none;
}

#feature_cards {
  text-align: center;
}

b-card {

}

</style>
