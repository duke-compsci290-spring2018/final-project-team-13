let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

let redirect_uri =
  "http://localhost:8888/callback" ||
  'https://testserver290.herokuapp.com/callback'

app.get('/login', function(req, res) {
  var show_dialog = req.query.show_dialog || false
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: "c5b9f69e59c04021b19c43afcf3336ca",
      scope: 'user-read-private playlist-read-private user-top-read user-library-read user-follow-read',
      redirect_uri,
      show_dialog: show_dialog
    }))
})

app.get('/refresh', function(req, res) {
  let refresh_token = req.query.refresh_token || null
  console.log("> Refreshing access token with refresh token: " + refresh_token);
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
       "c5b9f69e59c04021b19c43afcf3336ca" + ':' + "6f899828a4eb4ff6bee73f069392a0be"
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = "https://motif-290.firebaseapp.com/home"
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
        "c5b9f69e59c04021b19c43afcf3336ca" + ':' + "6f899828a4eb4ff6bee73f069392a0be"

      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    var refresh_token = body.refresh_token
    let uri = "http://localhost:8080/home" || "https://motif-290.firebaseapp.com/home"
    res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)