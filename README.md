# motif

> A visualization of Spotify users' listening profile

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Instructions to Run Local Server

``` bash
# provide the environment with Spotify Client ID and SECRET

export SPOTIFY_CLIENT_ID=example_id

export SPOTIFY_CLIENT_SECRET=example_secret

echo $SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_ID

echo $SPOTIFY_CLIENT_SECRET SPOTIFY_CLIENT_SECRET

# start the back end server
npm start

# start the front end server
npm run dev
```

## Deploy to Heroku

``` bash
heroku create mybackend
# provide the environment with Spotify Client ID and SECRET

heroku config:set SPOTIFY_CLIENT_ID=example_id

heroku config:set SPOTIFY_CLIENT_SECRET=example_secret

heroku config:set REDIRECT_URI=https://fathomless-inlet-73184.herokuapp.com/callback

heroku config:set FRONTEND_URI=https://fathomless-inlet-73184.herokuapp.com/


git push heroku master

# start the back end server
npm start

# start the front end server
npm run dev
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
