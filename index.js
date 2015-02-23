var fs = require('fs');
var express = require('express');
var app = express();
var lessMiddleware = require('less-middleware');
var Pegel = require('./lib/Pegel.js');
var relic = require('newrelic');
var logentries = require('le_node');

/**
 * Load Configuration
 */
var config = JSON.parse(fs.readFileSync('./config/app.json'));
var mapping = JSON.parse(fs.readFileSync('./config/mapping.json'));

var log = logentries.logger({ token:'18bf7167-80db-44b3-868e-f2514f31552f' });
/**
 * Configure Express.js
 */
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

/**
 * Index - Redirect to default
 */
app.get('/hamburg', function(req, res) {
  var location = mapping['hamburg'];
  Pegel.get(location, function(data) {
    var response = {
      title: "Aktueller Pegelstand der Elbe in " + location.label,
      name: location.name,
      label: location.label,
      geo: location.geo,
      data: data
    };    
    
    if (data.cached) {
      log.notice("From Cache: " + location.label, {source: 'cache', location: location.label});
    } else {
      log.notice("From Remote: " + location.label, {source: 'remote', location: location.label});
    }
    
    res.render('location', response);
  });  
});


app.get('/impressum', function(req, res) {
  res.render('impressum', {title: 'Impressum von pegel.JETZT'});
});

/**
 * Start Express.js
 */
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
