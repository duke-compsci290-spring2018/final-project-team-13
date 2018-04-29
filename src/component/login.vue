<template>
    <b-container fluid id="body" v-show="sample_graph_loaded && login_ready">
        <div id="graph">
        </div>
        <div id="overlay_login">
          <!-- <img id="main_logo" src="../assets/motif_logo.png" alt="Motif Logo" draggable=false> -->
          <img id="main_logo" :src="require('../assets/motif_logo.png')" alt="Motif Logo" draggable=false />
          <h4>Wakanda music you listening to?</h4>
          <b-button id="login" class="btn-success" @click="sign_in">
            Log In With Spotify <i class="fab fa-spotify"></i>
          </b-button>
        </div>


    </b-container>
</template>

<script>
import vis from 'vis';
import { router, db, users_ref, store } from '../main.js'

export default {
  name: 'login',
  data () {
    return {
        login_ready: false,
        sample_graph_loaded: false,
    }
  },
  computed: {

  },
  beforeMount() {
    this.login_ready = false
    let access_token = localStorage.getItem("access_token")
    let refresh_token = localStorage.getItem("refresh_token")

    if ( access_token && refresh_token) {

      // Get current user info from firebase by searching for access token and refresh token
      users_ref.once("value").then(function(snapshot) {
        snapshot.forEach(child => {
          if (access_token == child.val().access_token && refresh_token == child.val().refresh_token) {
            store.commit("updateCurrentUser", child.val())
            // console.log("> Updated current user from localStorage!")
            router.push({ name: "home" })
          }
        })
      })
    }
    else {
      // console.log("> Regular login flow")
      this.login_ready = true
    }
  },
  mounted() {
      this.sample_graph()
      this.clear_id()
  },
  methods: {
    sign_in() {
          // redirect to login window in the backend
          window.location = process.env.LOGIN_URL
          // || "http://localhost:8888/login" + "?show_dialog=true";
    },
    clear_id() {
        if(localStorage.getItem("user_id") !== undefined) localStorage.removeItem("user_id");
    },
    sample_graph() {

        let all_nodes = new vis.DataSet();
        let all_edges = new vis.DataSet();
        let container = document.getElementById('graph');
        let options = {
            nodes: {
                mass: 1,
                size: 35,
                shadow: {
                    enabled: true,
                    size: 25,
                },
                font: {
                    face: '\'Josefin Sans\', sans-serif',
                },
                color: {
                    border: 'rgba(0, 0, 0, 0.4)',
                    highlight: {
                        border: 'rgba(0, 0, 0, 0.4)',

                    },
                    hover: {
                        border: 'rgba(0, 0, 0, 0.4)',
                    }
                },
            },
            edges: {
                width: 3,
                selectionWidth: 3,
                shadow:{
                  enabled: true,
                  size:10,
                },
                smooth: {
                  enabled: true,
                  type: "dynamic",
                  roundness: 0.5
                },
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
            },
            physics: {
                barnesHut: {
                  gravitationalConstant: -2000,
                  centralGravity: 1,
                  springLength: 100,
                  springConstant: 0.03,
                  damping: 0.3,
                  avoidOverlap: 0.5,
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
              }
            }
        };

        all_nodes.add([
            {id: "1", label: "21 Savage", shape: "circularImage", image: "https://i.scdn.co/image/d664edbc9c83c443a56a5d97a44a105e27c20d20", group: 'level0_node'},
            {id: "2", label: "Lil Uzi Vert", shape: "circularImage", image: "https://i.scdn.co/image/7b94c58fe065dc4443d4be1727d2165aed0758bf", group: 'level0_node'},
            {id: "3", label: "Kodak Black", shape: "circularImage", image: "https://i.scdn.co/image/5a428596636f28fb55b5bb0006a7ce385d5be69b", group: 'level0_node'},
            {id: "4", label: "PnB Rock", shape: "circularImage", image: "https://i.scdn.co/image/289ebd917b8b7d31bfe403f4c0135b5c83bdaa1b", group: 'level0_node'},
            {id: "5", label: "Fetty Wap", shape: "circularImage", image: "https://i.scdn.co/image/01cccc4370aa911413b2a20db2089ff1080e082e", group: 'level0_node'},
            {id: "6", label: "KYLE", shape: "circularImage", image: "https://i.scdn.co/image/59ca568df03f275320a8a2d8dc8dc226bfa7bbb3", group: 'level0_node'},
            {id: "7", label: "Hoodie Allen", shape: "circularImage", image: "https://i.scdn.co/image/1be21acf6e0d0c66a852c81fe99f0da0e3432935", group: 'level0_node'},
            {id: "8", label: "Bryce Vine", shape: "circularImage", image: "https://i.scdn.co/image/303dc58af91aef73fa64814cc52def4419f7dc63", group: 'level0_node'},
            {id: "9", label: "Timeflies", shape: "circularImage", image: "https://i.scdn.co/image/6c709d0a985278765ea0f52028a33dd57bca066f", group: 'level0_node'},
            {id: "10", label: "Two Friends", shape: "circularImage", image: "https://i.scdn.co/image/390073ba0eb8b40438cc2d1ad0ce8385e6b87fec", group: 'level0_node'},
            {id: "11", label: "Gryffin", shape: "circularImage", image: "https://i.scdn.co/image/883bfaf16494266143f52925ceebdb85b83b7a35", group: 'level0_node'},
            {id: "12", label: "San Holo", shape: "circularImage", image: "https://i.scdn.co/image/2e10b52a9fc4b6c52c5e7f1e24da0953f2b12061", group: 'level0_node'},
            {id: "13", label: "Allison Wonderland", shape: "circularImage", image: "https://i.scdn.co/image/c00aa38f20a0ce6d56ad9a3d617eae34e988d62a", group: 'level0_node'},
            {id: "14", label: "RL Grime", shape: "circularImage", image: "https://i.scdn.co/image/066b623486935248b5460af8c54cfc845ce44224", group: 'level0_node'},
            {id: "15", label: "Yellow Claw", shape: "circularImage", image: "https://i.scdn.co/image/4adf9701ba61aa04fbca941c671a0d2c8ea9d8e9", group: 'level0_node'},
            {id: "16", label: "DVBBS", shape: "circularImage", image: "https://i.scdn.co/image/f054516e545accf43efb2530855a7379257d7a4f", group: 'level0_node'},
            {id: "17", label: "Hardwell", shape: "circularImage", image: "https://i.scdn.co/image/d20f4298c96e976ecebf3d25e5d72a0929c90cd9", group: 'level0_node'},
            {id: "18", label: "Nicky Romero", shape: "circularImage", image: "https://i.scdn.co/image/6b1d1296aa28d52366edfdce7d6ec4e09a5185b8", group: 'level0_node'},
            {id: "19", label: "Alesso", shape: "circularImage", image: "https://i.scdn.co/image/69fa09f6e181093fe0ea2ce1a4099066509f7837", group: 'level0_node'},
            {id: "20", label: "Avicii", shape: "circularImage", image: "https://i.scdn.co/image/9c0d8fa969a9f5db6ff860203d6880a125e501d2", group: 'level0_node'},

        ])
        all_edges.add([
            {from: "1", to: "2"},
            {from: "2", to: "3"},
            {from: "3", to: "4"},
            {from: "4", to: "5"},
            {from: "5", to: "6"},
            {from: "6", to: "7"},
            {from: "7", to: "8"},
            {from: "8", to: "9"},
            {from: "9", to: "10"},
            {from: "10", to: "11"},
            {from: "11", to: "12"},
            {from: "12", to: "13"},
            {from: "13", to: "14"},
            {from: "14", to: "15"},
            {from: "15", to: "16"},
            {from: "16", to: "17"},
            {from: "17", to: "18"},
            {from: "18", to: "19"},
            {from: "19", to: "20"}
        ])

        let data = {
            nodes: all_nodes,
            edges: all_edges,
        }

        var network = new vis.Network(container, data, options);

        this.sample_graph_loaded = true;
    },
  }
}
</script>

<style>
#body {
  margin: 0;
  padding: 0;
}

#main_logo {
  display: block;
  margin: auto;
  width: 40%;
  padding-bottom: 10px;
}

#graph {
  width: 100vw;
  height: 100vh;
}

#overlay_login {
  position: fixed;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 10px;
  top: 0%;
  left: 20%;
  width: 60%;
}

</style>
