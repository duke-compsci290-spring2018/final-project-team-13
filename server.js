var history = require('connect-history-api-fallback');
var express = require('express');
var path = require('path');

var app = express();

app.use(history());
app.use(express.static(__dirname))

var port = process.env.PORT || 8080;

app.listen(port);
console.log('server started '+ port);