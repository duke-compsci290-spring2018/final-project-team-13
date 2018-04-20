<template>
    <div id="body">
        <h3>This is what your top 20 tracks look like in...</h3>
        <!-- canvas for chartjs -->
        <div class="chart-container">
            <canvas id="myChart"></canvas>
        </div>
         <!-- <button type="button" class="btn btn-danger" @click="analyze_features(), draw_graph()">Analyze</button> -->
         <div id="wrapper">
            <ul v-if="avg_features != null">
                <li v-for="feat in avg_features[dataset_index]">
                    {{ feat.type }}: {{ feat.point }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    props: ['user_selected', 'audioFeatures_short', 'audioFeatures_medium', 'audioFeatures_long'],
    data() {
        return {
            features_short: this.audioFeatures_short,
            features_medium: this.audioFeatures_medium,
            features_long: this.audioFeatures_long,
            avg_features: null,
            dataset_index: 0
        }
    },
    mounted() {
        this.set_dataset_index();
        this.analyze_features();
        this.pack_data();
        this.draw_graph();
    },
    watch: {
        user_selected: function() {
            // once time period has been changed, change the graph accordingly
            this.set_dataset_index();
        }
    },
    methods: {
        set_dataset_index() {
            if(this.user_selected === "short") this.dataset_index = 0;
            else if(this.user_selected === "medium") this.dataset_index = 1;
            else this.dataset_index = 2;
        },
        analyze_features(input) {
            let features = null;
            if(input === "short") features = this.features_short;
            else if(input === "medium") features = this.features_medium;
            else features = this.features_long;

            let counter = 0;

            let avg_feat = [
                {point: 0, type: 'danceability' },
                {point: 0, type: 'energy' },
                // {point: 0, type: loudness },
                {point: 0, type: 'speechiness' },
                {point: 0, type: 'acousticness' },
                {point: 0, type: 'instrumentalness' },
                {point: 0, type: 'valence' },
                // {point: 0, type: tempo }
            ]

            features.audio_features.forEach(track => {
                // accumulate each feature of all tracks
                avg_feat.forEach(feat => {
                    feat.point += track[feat.type];
                })
                counter ++;
            })

            // get the average numbers
            avg_feat.forEach(feat => {
                feat.point = (feat.point*10/counter).toFixed(1);
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
                        easing: 'easeInOutBounce',
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
        },
    },
}
</script>

<style>
.body {
    position: relative;
}

.chart-container {
    position: relative;
    margin: auto;
    height: 60vh;
    width: 100vh;
}

#wrapper ul{
    list-style-type: none;
}
</style>
