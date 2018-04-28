<template>
    <div id="body">
        <div id="graph">
        </div>
        <div id="slogan">
            <h3>Know What You Listen To</h3>
            <button v-if="sample_graph_loaded" id="log_in" type="button" class="btn btn-success" @click="sign_in">Log In With Spotify <i class="fab fa-spotify"></i></button>
        </div>
    </div>
</template>

<script>
import queryString from 'query-string';
import vis from 'vis';

export default {
  name: 'login',
  data () {
    return {
        profile: null,
        sample_graph_loaded: false,
    }
  },
  computed: {

  },
  mounted() {
      this.sample_graph()
      this.clear_id()
  },
  methods: {
    sign_in() {
          // redirect to login window in the backend
          window.location = process.env.LOGIN_URL || "http://localhost:8888/login";
        //   'https://motif-back-end.herokuapp.com/login';
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
                //  '<b>Fastback Networks</b> <br><br>' + 'Country: ' + 'USA' + '<br>' + 'City: ' + 'San Jose',
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
                tooltipDelay: 1,
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
        };

        all_nodes.add([
            {id: "1", label: "Avicii", shape: "circularImage", image: "https://i.scdn.co/image/9c0d8fa969a9f5db6ff860203d6880a125e501d2"},
            {id: "2", label: "Marshmello", shape: "circularImage", image: "https://i.scdn.co/image/399ff9280695787d76901bfffdf3f200ec528b2b"},
            {id: "3", label: "Coldplay", shape: "circularImage", image: "https://i.scdn.co/image/9815eb48540fa0d1c87ebd22289060729b1ab32a"},
            {id: "4", label: "Ed Sheeran", shape: "circularImage", image: "https://i.scdn.co/image/e21f791b600f04f9dd8ad2b6d9b3304a82e048ca"},
            {id: "5", label: "21 Savage", shape: "circularImage", image: "https://i.scdn.co/image/d664edbc9c83c443a56a5d97a44a105e27c20d20"},
        ])
        all_edges.add([
            {from: "1", to: "3"},
            {from: "3", to: "4"},
            {from: "1", to: "2"},
            {from: "2", to: "5"},
        ])

        let data = {
            nodes: all_nodes,
            edges: all_edges,
        }

        var network = new vis.Network(container, data, options);

        this.sample_graph_loaded = true;
    },
  },
}
</script>

<style>
#graph {
    margin-top: 0px;
    width: 100vw;
    height: 90vh;
    margin-left: 0px;

}

#slogan {
    position: fixed;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    padding-bottom: 20px;
    padding-top: 10px;
    top:40%;
    left:15%;
    width: 70%;
}

#slogan h3 {
    font-size: 40px;
}
</style>
