var fs = require('fs');
var express = require('express');
var app = express();
var lessMiddleware = require('less-middleware');
var Pegel = require('./lib/Pegel.js');

/**
 * Load Configuration
 */
var config = JSON.parse(fs.readFileSync('./config/app.json'));
var mapping = JSON.parse(fs.readFileSync('./config/mapping.json'));

/**
 * Configure Express.js
 */
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

/**
 * 404 - Not Found
 */
app.get('/404', function(req, res) {
  res.render('404', {title: 'Atlantis'});
});

/**
 * Index - Redirect to default
 */
app.get('/', function(req, res) {
  res.redirect('/' + config.default);
});

/**
 * Pegel
 */
app.get('/:location', function(req, res) {
  if (!mapping[req.param('location')]) {
    res.redirect('/404');
  } else {
    Pegel.get(mapping[req.param('location')], function(data) {
      console.log(data);
      res.render('data', {title: data.name});
    });  
  }
});

/**
 * Start Express.js
 */
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
