<template>
    <div>
        <h3>This is what your top tracks look like</h3>
        <div id="chart"></div>
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
import * as d3 from "d3";

export default {
    props: ['user_selected', 'audioFeatures_short', 'audioFeatures_medium', 'audioFeatures_long'],
    data() {
        return {
            features_short: this.audioFeatures_short,
            features_medium: this.audioFeatures_medium,
            features_long: this.audioFeatures_long,
            avg_features: null,
            graph_height: null,
            dataset_index: 0
        }
    },
    mounted() {
        this.set_dataset_index();
        this.analyze_features();
        this.pack_features();
        this.draw_graph();
    },
    watch: {
        user_selected: function() {
            // once time period has been changed, change the graph accordingly
            this.set_dataset_index();
            // this.graph_transition();
            this.draw_graph();
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
        pack_features() {
            let short = this.analyze_features("short");
            let medium = this.analyze_features("medium");
            let long = this.analyze_features("long");
            this.avg_features = [short, medium, long];
        },
        draw_graph() {
            d3.select("#chart > *").remove();
            // list of features
            var types = this.avg_features[0].map(feat => {
                return feat.type
            });
            // width and height of svg element
            var fullWidth = 500;
            var fullHeight = 350;
            // width and height of the bar chart
            var margin = {top: 5, right: 5, bottom: 50, left: 50};
            var width = fullWidth - margin.left - margin.right;
            var height = fullHeight - margin.top - margin.bottom;
            this.graph_height = height;
            // var color = d3.scale.category20();

            var svg = d3.select('#chart').append('svg')
            .attr('width', fullWidth)
            .attr('height', fullHeight)
            // g is the where the chart will be drawn
            .append('g')
            // leave room for top and left of the graph
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // x value are the different features of audio
            var feature_scale = d3.scaleBand()
                                .domain(types)
                                .range([0, width])
                                .paddingInner(0.3);

            // the width of each bar
            var bandwidth = feature_scale.bandwidth();

            // y value indicating the points on different features
            var max_point = 10;
            var point_scale = d3.scaleLinear()
                                .domain([0, max_point])
                                .range([height, 0])
                                // rounding extreme values
                                .nice();

            // set x and y axis
            var xAxis = d3.axisBottom(feature_scale);
            var yAxis = d3.axisLeft(point_scale);

            // draw x and y axis
            var xAxisEle = svg.append('g')
                .classed('x axis', true)
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            var yAxisEle = svg.append('g')
                .classed('y axis', true)
                .call(yAxis);

            // label the axis
            var yText = xAxisEle.append('text')
                        .attr('transform', 'translate('+ width/2 +', 40)')
                        .style('text-anchor', 'middle')
                        .style('fill', 'black')
                        .attr('dx', '-10mm')
                        .style('font-size', 14)
                        .text('Feature');

            var yText = yAxisEle.append('text')
                      .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
                      .style('text-anchor', 'middle')
                      .style('fill', 'black')
                      .attr('dy', '-6mm')
                      .style('font-size', 14)
                      .text('Point');

            var barHolder = svg.append('g')
                    .classed('bar-holder', true);

            function color_scheme(i) {
                let max_count = 0;
                types.forEach(t => max_count++)
                return (d3.interpolateWarm(i/max_count));
            }
            // draw the bars
            var bars = barHolder.selectAll('rect.bar')
                        .data(this.avg_features[this.dataset_index])
                        .enter()
                        .append('rect')
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
                        })
                        .attr('fill', function(d, i){return color_scheme(i)})
                        .append("text")
                        .text(function(d){
                            console.log(d.point)
                            return d.point})
                        .attr("text-anchor", "middle")
                        .attr('x', function(d, i) {
                          return feature_scale(d.type);
                        })
                        .attr('y', function(d) {
                          return point_scale(d.point)-20;
                        })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "11px")
                        .attr("fill", "red");



        },
        graph_transition() {
            var point_scale = d3.scaleLinear()
                                .domain([0, 10])
                                .range([this.graph_height, 0])
                                // rounding extreme values
                                .nice();

            d3.selectAll(".bar")
                .transition()
                // .attr("height", function(d) {
                //     return this.graph_height - point_scale(d.point);
                // })
                // .attr("x", function(d) {
                //     console.log(d);
                // })
                .attr("y", function(d) {
                    return point_scale(d.point);
                })
                // .ease("linear")
                // .select("title")
                // .text(function(d) {
                //
                // });
        },

    },
}
</script>

<style>

</style>
