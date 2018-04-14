<template>
    <div>
        <h3>This is what your top tracks look like</h3>
         <button type="button" class="btn btn-danger" @click="analyze_features(), draw_chart()">Analyze</button>
        <div id="chart">
            <ul>
                <svg></svg>
                <li v-for="feat in avg_features">
                    {{ feat.type }}: {{ feat.point }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
    props: ['audioFeatures'],
    data() {
        return {
            features: this.audioFeatures,
            avg_features: null
        }
    },
    computed: {
    },
    methods: {
        analyze_features() {
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

            this.features.audio_features.forEach(track => {
                // accumulate each feature of all tracks
                avg_feat.forEach(feat => {
                    feat.point = track[feat.type];
                })
                counter ++;
            })

            // get the average numbers
            avg_feat.forEach(feat => {
                feat.point = feat.point/counter;
            })

            this.avg_features = avg_feat;
        },
        draw_chart() {
            var temperatures = [
  {point: 0.6, type: 'January'},
  {point: 0.1, type: 'February'},
  {point: 0.3, type: 'March'},
  {point: 0.8, type: 'April'}
];
            var types = this.avg_features.map(feat => {
                console.log(feat.type)
                return feat.type
            });

            var fullWidth = 700;
            var fullHeight = 200;
            var margin = {top: 20, right: 20, bottom: 30, left: 40};
            var width = fullWidth - margin.left - margin.right;
            var height = fullHeight - margin.top - margin.bottom;

            var svg = d3.select('svg').append('svg')
                        .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var feature_scale = d3.scaleBand()
                                .domain(types)
                                .range([0, width])
                                .paddingInner(0.1);

            var bandwidth = feature_scale.bandwidth();

            var max_point = 1;
            var point_scale = d3.scaleLinear()
                                .domain([0, max_point])
                                .range([height, 0])
                                .nice();

            var xAxis = d3.axisBottom(feature_scale);
            var yAxis = d3.axisLeft(point_scale);

            var xAxisEle = svg.append('g')
                .classed('x axis', true)
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            var yAxisEle = svg.append('g')
                                .classed('y axis', true)
                                .call(yAxis);

            var yText = yAxisEle.append('text')
                      .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
                      .style('text-anchor', 'middle')
                      .style('fill', 'black')
                      .attr('dy', '-2.5em')
                      .style('font-size', 14)
                      .text('Point');

            var barHolder = svg.append('g')
                                .classed('bar-holder', true);

                                var bars = barHolder.selectAll('rect.bar')
                        .data(temperatures)
                      .enter().append('rect')
                        .classed('bar', true)
                        .attr('x', function(d, i) {
                          return feature_scale(d.type);
                        })
                        .attr('width', bandwidth)
                        .attr('y', function(d) {
                          return point_scale(d.point);
                        })
                        .attr('height', function(d) {
                          // the bar's height should align it with the base of the chart (y=0)
                          return height - point_scale(d.point);
                        });

        }
    },
}
</script>
