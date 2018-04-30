# Motif

> A visualization of Spotify users' listening profile

Try it out at https://motif-290.firebaseapp.com/

## Instructions to Run Motif Locally
First, clone the git repo. Then, cd into the folder you just cloned and install all necessary dependencies using npm.
``` bash
# install dependencies
npm install

```
Next, you will need to open two terminals or command prompts: one for the backend server which communicates with Spotify's OAuth servers, and one for the frontend client which serves our Vue app.

### Instructions to Run Local Client

``` bash
npm run dev
```

This starts a hot-reloading dev server to host Motif locally at localhost:8080. The source code is currently setup to communicate with our backend hosted on Heroku, but you can easily comment the relevant lines of code containing `window.location` in favor or running your own local backend server. The most important line to revise is within the `sign_in()` method in `login.vue`. The others are simply there for refreshing the access token.


### Instructions to Run Local Server

``` bash
# start the back end server
npm run start-backend
```
This runs a local backend server on localhost:8888 which your local frontend client can communicate with, if you have done all the necessary commenting and uncommenting.

Please be courteous and use your own Spotify client ID and secrets, as well as your own Firebase API key, if you are planning on making a mass amount of queries. You MUST change all redirect URIs/URLs in `backend/server.js` to localhost in order for your local client-server setup to work.


# Motif Project README
**Names (net IDs):** Elbert Wang (elw34), Kevin Cheng (qc25)

**Date Started:** 4/7/18

**Date Completed:** 4/29/18

**Number of Hours Worked:** 80

**Collaborators:** Just each other

**Resources Used:** Spotify API, Vue.js, Firebase, Vis.js, Chart.js, Express, Node, Heroku, Stackoverflow.com, Vue-Bootstrap, Vuex, Vue Router

**Assets Used:** All data was pulled either from Spotify API endpoints or created by us. Some gradient designs were from UIGradients.com. Logo and favicon were designed by us.

**Bugs or Concerns:** We worked through many of the main bugs, but the ones that remain have to do with localStorage and our relatively messy front-end routing setup.

**What makes your application useful:** It's a great way to visualize your listening habits in a very fun, interactive, and aesthetic way!!! Give it a try at https://motif-290.firebaseapp.com/

**Special instructions needed to set up, run, access, or use your application (like user passwords you have set up, command line utilities, or external programs that need to be run):** To run your own local copy, you will need to follow the instructions above. Feel free to contact one of us if you are having trouble.

**References for your data that establishes its authenticity:** We use the official Spotify API. For more information, visit https://beta.developer.spotify.com/

**Discuss both the pros and the cons of different framework possibilities you considered and why you made the decision you did (including choosing not to use any framework):** Our original plan was to focus on using d3.js to create visualizations. However, d3 was a lot more low level than we realized. While it allows for more customization, we were overwhelmed with the learning curve and quickly jumped ship to alternatives like Chart.js and Vis.js.

We decided to stick with Vue and Node/Express because it was the framework we had been using before in class and it was a good decision. We got off the ground running pretty fast with a prototype. We relied heavily on components, Vue Router, Vuex, and Vue-Bootstrap to create our frontend.

While Firebase was a minor addition, its ease of use really allowed us to reduce the problems we had with deploying to Heroku. In the end, we used Firebase hosting for our frontend app since Heroku was giving us some issues.

**Extra Credit:** N/A
