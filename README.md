# Motif

> A visualization of Spotify users' listening profile

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
```

## Instructions to Run Local Server

``` bash
# provide the environment with Spotify Client ID and SECRET

export SPOTIFY_CLIENT_ID=your_spotify_client_id

export SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

echo $SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_ID

echo $SPOTIFY_CLIENT_SECRET SPOTIFY_CLIENT_SECRET

# start the back end server
npm run start

```

## Instructions to Run Local Client

``` bash
export FIREBASE_API_KEY=your_firebase_api_key

echo $FIREBASE_API_KEY FIREBASE_API_KEY

npm run dev

```

## Deploy Server to Heroku

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
