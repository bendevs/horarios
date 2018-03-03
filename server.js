var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/AngularFrontEnd'));
app.listen(3045);
