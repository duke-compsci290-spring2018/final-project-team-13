<template>
    <div id="body">

      <h3>Average Audio Features of your top 20 tracks</h3>
      <b-row id="options_wrapper">
        <div id="options">
           <b-form-select v-model="time_selected" :options="time_options" class="mb-3">
               <option slot="first" :value="null" disabled>Time Period</option>
           </b-form-select>
         </div>
         <div id="load">
           <b-button v-on:click="draw_graph">Load graph</b-button>
         </div>
      </b-row>

<b-row id="graph_list_wrapper">
  <b-col>
      <!-- canvas for chartjs -->
      <div class="chart-container">
          <canvas id="myChart"></canvas>
      </div>
</b-col>
<b-col id="list">
        <ul v-if="avg_features != null">
          <li v-for="feat in avg_features[dataset_index]">
            {{ feat.type }}: {{ feat.point }}
          </li>
        </ul>
    </b-col>
</b-row>
    </div>
</template>

<script>

export default {
  name: "average_audio_features",
  data() {
      return {

        time_selected: null,
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
  async mounted() {
      this.get_features()
      // redirect user to login if no access_token
      if (!localStorage.getItem("access_token")) {
        // redirect to login window in the backend
        window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
      }
  },
  watch: {
      time_selected: function(val) {
          if (val === 'short') {
              this.dataset_index = 0;
          }
          else if (val === 'medium') {
              this.dataset_index = 1;
          }
          else {
              this.dataset_index = 2;
          }
      }
  },
  methods: {
    get_features() {
      // retrieve access token from localStorage
      var access_token = localStorage.getItem("access_token");

      // top tracks in short term
      fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(raw_data => {
          return raw_data.json();
      }).then(data => {
          let track_ids = "";
          data.items.forEach(track => {
              track_ids += track.id + "%2C";
          });
          track_ids = track_ids.substring(0, track_ids.length-3);

          // get audio features
          fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  'Authorization': 'Bearer ' + access_token
              },
          }).then(raw_data => {
              return raw_data.json();
          }).then(data => {
              this.features_short = data;
              console.log("Features (Short)", this.features_short);
          });
      });

      // top tracks in medium term
      fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(raw_data => {
          return raw_data.json();
      }).then(data => {
        let track_ids = "";
        data.items.forEach(track => {
            track_ids += track.id + "%2C";
        });
        track_ids = track_ids.substring(0, track_ids.length-3);

        // get audio features
        fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(raw_data => {
            return raw_data.json();
        }).then(data => {
            this.features_medium = data;
            console.log("Features (Medium)", this.features_medium);
        });
      });

      // top tracks in long term
      fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20&offset=0' , {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + access_token
          },
      }).then(raw_data => {
          return raw_data.json();
      }).then(data => {
        let track_ids = "";
        data.items.forEach(track => {
            track_ids += track.id + "%2C";
        });
        track_ids = track_ids.substring(0, track_ids.length-3);

        // get audio features
        fetch('https://api.spotify.com/v1/audio-features?ids=' + track_ids, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(raw_data => {
            return raw_data.json();
        }).then(data => {
            this.features_long = data;
            console.log("Features (Long)", this.features_long);
        });
      });

    },
    analyze_features(input) {
        let features = null;
        if(input === "short") features = this.features_short;
        else if(input === "medium") features = this.features_medium;
        else features = this.features_long;

        let num_tracks = 0;

        let avg_feat = [
            {point: 0, type: 'danceability' },
            {point: 0, type: 'energy' },
            {point: 0, type: 'loudness' }, // TODO: scale decibels to 1-10
            {point: 0, type: 'speechiness' },
            {point: 0, type: 'acousticness' },
            {point: 0, type: 'instrumentalness' },
            {point: 0, type: 'valence' },
            {point: 0, type: 'tempo' } //TODO: scale tempo to 1-10
        ]

        features.audio_features.forEach(track => {
          // find sum of all audio features
          avg_feat.forEach(feat => {
            if (feat.type == "loudness") {
              feat.point -= track[feat.type]
            }
            else {
              feat.point += track[feat.type];
            }
          })
          num_tracks ++;
        })

        // get average values and scale them if necessary
        avg_feat.forEach(feat => {
          if (feat.type == "loudness") {
            feat.point = (feat.point/num_tracks).toFixed(1);
          }
          else if (feat.type == "tempo") {
            feat.point = ((feat.point/num_tracks)/24).toFixed(1);
          }
          else feat.point = (feat.point*10/num_tracks).toFixed(1);
        })

        return avg_feat;
    },
    pack_data() {
        let short = this.analyze_features("short");
        let medium = this.analyze_features("medium");
        let long = this.analyze_features("long");
        this.avg_features = [short, medium, long];
    },
    draw_graph() {
      this.pack_data();

      var ctx = document.getElementById('myChart').getContext("2d");
      // labels for the charts: what type of feature
      let label_data = this.avg_features[0].map(data => {return data.type});
      // datasets for the charts
      let short_data = this.avg_features[0].map(data => {return data.point});
      let medium_data = this.avg_features[1].map(data => {return data.point});
      let long_data = this.avg_features[2].map(data => {return data.point});
      // common config
      let tension = 0;
      let bWidth = 2;
      let bJoinStyle = 'round';
      let pStyle = 'rectRounded';
      let pRadius = 4;
      let pHoverRadius = 6;
      let pHoverBorderWidth = 10;
      // config for gradient
      let x = 370;
      let y = 200;
      let alpha = 0.2;
      // gradient
      var gradientStroke1 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientStroke1.addColorStop(0, '#80b6f4');
      gradientStroke1.addColorStop(1, '#f49080');
      var gradientFill1 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientFill1.addColorStop(0, "rgba(128, 182, 244, "+ alpha +")");
      gradientFill1.addColorStop(1, "rgba(244, 144, 128, "+ alpha +")");
      var gradientStroke2 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientStroke2.addColorStop(0, '#bce784');
      gradientStroke2.addColorStop(1, '#348aa7');
      var gradientFill2 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientFill2.addColorStop(0, "rgba(188, 231, 132, "+ alpha +")");
      gradientFill2.addColorStop(1, "rgba(52, 138, 167, "+ alpha +")");
      var gradientStroke3 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientStroke3.addColorStop(0, '#a8dadc');
      gradientStroke3.addColorStop(1, '#1d3557');
      var gradientFill3 = ctx.createRadialGradient(x, y, 0, x, y, 200);
      gradientFill3.addColorStop(0, "rgba(168, 218, 220, "+ alpha +")");
      gradientFill3.addColorStop(1, "rgba(29, 53, 87, "+ alpha +")");
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
      };
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
      };
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
      };
      let datasetCollection = [dataset1, dataset2, dataset3];

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
                      max: 10,
                      stepSize: 2,
                  },
                  pointLabels: {
                      fontSize: 16,
                  }
              },
              legend: {
                  position: 'bottom',
                  labels: {
                      fontSize: 16,
                  }
              },
              animation: {
                  duration: 2000,
                  easing: 'linear',
              }
          }
      });

      function intervalWrapper() {
          let index = 1;
          // immediately add the first dataset
          myRadarChart.data.datasets[0] = datasetCollection[0];
          myRadarChart.update();
          // then add the rest of the datasets
          var addData = setInterval(function() {
              if(index < datasetCollection.length) {
                  myRadarChart.data.datasets[index] = datasetCollection[index];
                  myRadarChart.update();
              } else {
                  clearInterval(addData);
              }
              index++;
          }, 1000);
      };

      intervalWrapper();
    }
  }
}
</script>

<style>
#body {
    padding-top:10px;
}

.chart-container {
    position: relative;
    margin: auto;
    height: 30vh;
    width: 70vw;
}

#options_wrapper {
    margin: 0 auto;
    width: 80%;
}

#options_wrapper #options {
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

</style>
