<template>
    <b-container fluid id="body">
      <div id="graph">
      </div>
      <div id="overlay_similar">
        <h3>Your Top 10 Artists</h3>
         <b-row id="options_wrapper">
             <!-- time selector -->
             <b-col>
               <div id="options">
                   <b-form-select v-model="time_selected" :options="time_options" placeholder="cool" class="mb-3">
                       <option slot="first" :value="null" disabled>Time Period</option>
                   </b-form-select>
               </div>
            </b-col>
             <!-- load and reload -->
             <b-col>
               <div id="load">
                   <b-button v-if="artists_loaded && load_graph_condition" class="btn-success" @click="init">Load Graph</b-button>
                   <b-button v-if="artists_loaded && reload_graph_condition" class="btn-info" @click="init">Reload Graph</b-button>
               </div>
             </b-col>
            <!-- modify the graph -->
            <b-col>
             <div id="actions">
                 <b-button v-if="add_lvl0_edge_condition" class="btn-outline-primary" @click="add_lvl0_edge">
                  Connect Top Artists
                </b-button>
                 <b-button v-if="add_lvl1_condition" class="btn-outline-primary" @click="add_lvl1">
                  Add Similar Artists
                </b-button>
                 <b-button v-if="related_artists_condition" class="btn-outline-primary" @click="display_only_related"> Display only similar artists </b-button>
                 <b-button v-if="all_artists_condition" class="btn-outline-primary" @click="display_all"> Display all artists </b-button>
             </div>
           </b-col>
         </b-row>


      </div>

    </b-container>
</template>

<script>
import queryString from 'query-string'
import vis from 'vis'
var Node = require('../js/tree.js')
import { router, db, users_ref, store } from '../main.js'

export default {
    mounted() {
        this.fetch_artist_data()
    },
    watch: {
        time_selected: function() {
            this.graph_loaded = false
        }
    },
    computed: {
        // get access token for Spotify api
        access_token() {
            return localStorage.getItem("access_token")
        },
        // logics for the action buttons
        data_ready() {
            return this.artists_short && this.artists_medium && this.artists_long
        },
        selected_data() {
            if(this.time_selected === 'short') return this.artists_short
            else if(this.time_selected === 'medium') return this.artists_medium
            else return this.artists_long
        },
        load_graph_condition() {
            return this.data_ready
                && this.time_selected
                && !this.graph_loaded
        },
        reload_graph_condition() {
            return this.graph_loaded
        },
        add_lvl0_edge_condition() {
            return this.data_ready
                && this.time_selected
                && this.lvl0_edges
                && !this.edge_added
        },
        add_lvl1_condition() {
            return this.data_ready
                && this.time_selected
                && this.lvl1_edges
                && this.lvl1_nodes
                && !this.lvl1_added
        },
        related_artists_condition() {
            return this.lvl1_added
                && !this.only_related
        },
        all_artists_condition() {
            return this.only_related

        },
        // data set of the graph
        data() {
            let res = {
                nodes: this.all_nodes,
                edges: this.all_edges,
            }
            return res
        }
    },
    data() {
        return {
            // top artist data
            artists_short: this.data_short,
            artists_medium: this.data_medium,
            artists_long: this.data_long,
            // tree structure
            artist_tree: null,
            // nodes and edges for the graph
            lvl0_nodes: null,
            lvl0_edges: null,
            lvl1_nodes: null,
            lvl1_edges: null,
            // options for the graph
            options: null,
            // the location in the html where the graph will be drawn
            container: null,
            // nodes and edges datasets
            all_nodes: null,
            all_edges: null,
            // conditions
            graph_loaded: false,
            edge_added: false,
            lvl1_added: false,
            only_related: false,
            // time period
            time_selected: null,
            time_options: [
                { value: 'short', text: "short term" },
                { value: 'medium', text: "medium term" },
                { value: 'long', text: "long term" }
            ],
            artists_loaded: false
        }
    },
    beforeMount() {
      this.artists_loaded = false
      let access_token = store.state.current_user.access_token
      let refresh_token = store.state.current_user.refresh_token

      // check for access token in state
      if (access_token && refresh_token) {
        // console.log("> Using current user access token & refresh token")
        access_token = store.state.current_user.access_token
        refresh_token = store.state.current_user.refresh_token
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
          })
        }
        else {
          // Last resort, return user to login page
          router.push({ name: "login" })
        }
      }
    },
    methods: {
        // prepare the data tree and initialize the graph
        init(){
            // logics
            this.edge_added = false
            this.lvl1_added = false
            this.only_related = false

            this.initialize_tree().then(tree => {
                let overlap_data = this.find_overlap(tree)
                let processed_data = this.process_overlap_data(overlap_data)
                this.initialize_graph_data(processed_data)
                this.draw_graph()
                this.graph_loaded = true
            })
        },
        // create the tree structure to store all artists and their dependency
        initialize_tree() {
            // initialize the root of the tree
            let a_tree = new Node("root")
            // the counter for user favorite artists list
            let counter = this.selected_data.items.length

            return new Promise(resolve => {
                this.selected_data.items.forEach(artist => {
                    let artist_node = new Node(artist.id, artist.name, "")
                    // add first level nodes to the root
                    a_tree.addChild(artist_node)
                    // for each first level node, fetch their similar artists
                    this.fetch_similar_data(artist.id).then(data => {
                        // the counter for lvl1 similar list
                        let lvl1_counter = data.length
                        data.forEach(artist => {
                            // add lvl1 node to lvl0 node
                            let lvl1_node = new Node(artist.id, artist.name, artist.url)
                            artist_node.addChild(lvl1_node)

                            lvl1_counter --
                            if(lvl1_counter === 0) counter--
                            if(counter === 0) resolve(a_tree)
                        })
                    })
                })
            })
        },
        // prepare the nodes and edges into the correct format to load in the graph
        initialize_graph_data(data) {
            let n0 = []
            let n1 = []
            let e0 = []
            let e1 = []

            this.selected_data.items.forEach(artist => {
                n0.push({id: artist.id, label: artist.name, group: 'level0_node', shape: 'circularImage', image: artist.images[1].url, title: "Popularity: " + artist.popularity})
            })

            let id_list = []
            data[0].forEach(artist => {
                if(!id_list.includes(artist.id)) {
                    id_list.push(artist.id)
                    n1.push({id: artist.id, label: artist.name, group: 'level1_node', shape: 'circularImage', image: artist.image})
                } else {

                }
            })

            data[1].forEach(edge => {
                e0.push(edge)
            })

            data[2].forEach(edge => {
                e1.push(edge)
            })

            this.lvl0_nodes = n0
            this.lvl1_nodes = n1
            this.lvl0_edges = e0
            this.lvl1_edges = e1

        },
        // set the configs and options for the graph and draw the graph
        draw_graph() {

            this.all_nodes = new vis.DataSet()
            this.all_edges = new vis.DataSet()
            // only add lvl0 nodes upon loading the graph
            this.all_nodes.add(this.lvl0_nodes)

            this.container = document.getElementById('graph')
            this.options = {
                nodes: {
                    mass: 1,
                    shadow: {
                        enabled: true,
                        size: 25,
                    },
                    font: {
                        face: '\'Avenir\', sans-serif',
                    },
                },
                edges: {
                    selectionWidth: 3,
                    smooth: {
                      enabled: true,
                      type: "dynamic",
                      roundness: 0.5
                    },
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 100
                },
                physics: {
                    barnesHut: {
                      gravitationalConstant: -2000,
                      centralGravity: 0.3,
                      springLength: 100,
                      springConstant: 0.03,
                      damping: 0.09,
                      avoidOverlap: 0,
                    },
                    solver: 'barnesHut',
                    timestep: 0.4,
                    stabilization: {
                     enabled: true,
                     iterations: 1500,
                     onlyDynamicEdges: false,
                     fit: true
                   },
                },
                groups: {
                    level0_node: {
                        size: 35,
                        borderWidth: 6,
                        color: {
                            border: 'rgba(0, 0, 0, 0.4)',
                            highlight: {
                                border: '#1db954',

                            },
                            hover: {
                                border: '#1db954',
                            }
                        },
                        font: {
                            color: '#191414',
                            size: 18,
                        }
                    },
                    level1_node: {
                        size: 25,
                        borderWidth: 0,
                        color: {
                        },
                        font: {
                            color: '#473939',
                        },
                    },
                }
            }

            var network = new vis.Network(this.container, this.data, this.options)
        },
        // draw the graph where only related artists are shown
        display_only_related() {
            this.only_related = true
            this.options.groups.level0_node.hidden = true
            var network = new vis.Network(this.container, this.data, this.options)
        },
        // draw the graph where all artists are shown
        display_all() {
            this.only_related = false
            this.options.groups.level0_node.hidden = false
            var network = new vis.Network(this.container, this.data, this.options)
        },
        // add edges that connects lvl0 nodes into the graph
        add_lvl0_edge() {
            this.all_edges.add(this.lvl0_edges)
            this.edge_added = true
        },
        // add lvl1 nodes and edges
        add_lvl1() {
            this.all_nodes.add(this.lvl1_nodes)
            this.all_edges.add(this.lvl1_edges)
            this.lvl1_added = true
        },
        // given a tree and an id, find the all nodes with that id
        find_node(root, id) {
            var queue = [root]
            let res = []
            while(queue.length > 0) {
                var node = queue.shift()
                if(node.id === id) res.push(node)
                for(var i = 0; i < node.getChildren().length; i++) {
                    queue.push(node.getChildren()[i])
                }
            }
            if(res.length === 0) return false
            else return res
        },
        // given a tree, find all nodes with same id and group them together
        find_overlap(root) {
            let res = []
            let queue = [root]
            while(queue.length > 0) {
                var node = queue.shift()
                if(node.level >= 1 && !res.includes(node)) {
                    let find = this.find_node(root, node.id)
                    if(find.length > 1) {
                        res.push(node)
                        find.forEach(res_node => {
                            if(res_node.getParentNode().id != node.getParentNode().id) {
                                res.push(res_node)
                            }
                        })
                    }
                }
                for(var i = 0; i < node.getChildren().length; i++) {
                    queue.push(node.getChildren()[i])
                }
            }

            if(res.length === 0) return false
            else return res
        },
        // given an array of grouped nodes, process them into nodes and edges for the graph
        process_overlap_data(array) {
            let data = array

            let lvl1_nodes = []
            let lvl0_edges = []
            let lvl1_edges = []

            let current_id = data[0].id || ""
            let current_group = []

            for(var i = 0; i < data.length; i++) {
                let node = data[i]

                if(node.id === current_id) {
                    current_group.push(node)
                } else {
                    current_id = node.id
                    let res = (this.generate_edges(current_group))
                    lvl1_nodes = lvl1_nodes.concat(res[0])
                    lvl0_edges = lvl0_edges.concat(res[1])
                    lvl1_edges = lvl1_edges.concat(res[2])
                    current_group = []
                    current_group.push(node)
                }

                if(i === data.length-1) {
                    let res = this.generate_edges(current_group)
                    lvl1_nodes = lvl1_nodes.concat(res[0])
                    lvl0_edges = lvl0_edges.concat(res[1])
                    lvl1_edges = lvl1_edges.concat(res[2])
                }
            }

            return [lvl1_nodes, lvl0_edges, lvl1_edges]
        },
        // generate edges based on node groups
        generate_edges(array) {
            let lvl1_nodes = []
            let lvl0_edges = []
            let lvl1_edges = []

            if(array[0].level === 1){
                for(var i = 1; i < array.length; i++) {
                    let node = array[i]
                    if(node.level >= 1) {
                        let parent = node.getParentNode()
                        if(parent.level === 1) {
                            let key = parent.id
                            let obj = {}
                            obj[key] = 1
                            lvl0_edges.push({from: array[0].id, to: parent.id, width: 5, color: 'black'})
                        }
                    }
                }
            }
            else {
                for(var i = 0; i < array.length; i++) {
                    let node = array[i]
                    if(node.level >= 1) {
                        let parent = node.getParentNode()
                        if(parent.level === 1) {
                            lvl1_nodes.push(node)
                            lvl1_edges.push({from: parent.id, to: node.id, width: 2, color: 'black'})
                        }
                    }
                }
            }
            return [lvl1_nodes, lvl0_edges, lvl1_edges]
        },
        // given an artist id, fetch all similar artists data from Spotify endpoint
        fetch_similar_data(id) {
            return new Promise((resolve, reject) => {
                fetch('https://api.spotify.com/v1/artists/'+ id +'/related-artists' , {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + this.access_token
                    },
                }).then(raw_data => {
                    return raw_data.json()
                }).then(data => {
                    let similar_array = []
                    data.artists.forEach(artist => {
                        let image_url = artist.images.length > 0 ? artist.images[1].url : ""
                        let artist_data = {id: artist.id, name: artist.name, url: image_url}
                        similar_array.push(artist_data)
                    })
                    resolve(similar_array)
                })
            })
        },
        // fetch user's top artists from Spotify endpoint
        fetch_artist_data() {
          // top artists in short term
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0' , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.access_token
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
                // TODO: configure REFRESH_URL within Heroku
                window.location = process.env.REFRESH_URL || "http://localhost:8888/refresh?refresh_token=" + store.state.current_user.refresh_token
                return
              }

              this.artists_short = data
            })

            // top artists in medium term
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0' , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.access_token
                },
            }).then(raw_data => {
                return raw_data.json()
            }).then(data => {
                this.artists_medium = data
            })

            // top artists in long term
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0' , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.access_token
                },
            }).then(raw_data => {
                return raw_data.json()
            }).then(data => {
                this.artists_long = data
            })

            this.artists_loaded = true
        },
    },
}
</script>

<style>
#overlay_similar {
  position: fixed;
  text-align: center;
  background: rgba(255, 255, 255, 0.7);
  padding-top: 5px;
  margin: 0;
  top: 65px;
  left: 5%;
  right: 5%;
  width: 90%;
}

#graph {
  width: 100vw;
  height: 100vh;
}

.vis-tooltip {
  background-color: White;
  border: 2px solid #1db954;
  box-shadow: 0 0 5px Black;
  position: absolute;
}

#body {
  margin: 0;
  padding: 0;
}

#options_wrapper {
  margin: 0 auto;
  width: 95%;
}

#options_wrapper #options {
  width: 60%;
  margin: 0 auto;
  display: table;
}

#options_wrapper #load {
  margin: 0 auto;
}

</style>
