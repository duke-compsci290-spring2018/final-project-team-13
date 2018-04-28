let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private playlist-read-private user-top-read user-library-read user-follow-read',
      redirect_uri
    }))
})

app.get('/refresh', function(req, res) {
  let refresh_token = req.query.refresh_token || null
  console.log("Refreshing access token with refresh token: " + refresh_token);
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    var refresh_token = body.refresh_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:8080/home'
    res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token)
  })
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    var refresh_token = body.refresh_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:8080/home'
    res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
