var fs = require('fs');
var express = require('express');
var app = express();
var lessMiddleware = require('less-middleware');
// var Pegel = require('./lib/Pegel.js');
var relic = require('newrelic');

/**
 * Load Configuration
 */
// var config = JSON.parse(fs.readFileSync('./config/app.json'));
// var mapping = JSON.parse(fs.readFileSync('./config/mapping.json'));
// var locations = JSON.parse(fs.readFileSync('./config/locations.json'));

var opbeat = require('opbeat')({
  organizationId: 'a0e689c14693414a9001d403fe1a23c2',
  appId: '5178715c70',
  secretToken: '85af1b548c26415413a2b7606ea359e50f4beb64'
});

// var Location = require('./locations/hamburg.js');
// var Hamburg = new Location();
// console.log(Hamburg.getLabel());

/**
 * Configure Express.js
 */
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(lessMiddleware(__dirname + '/public', {compress: false}));
app.use(express.static(__dirname + '/public'));
app.use(opbeat.middleware.express());
app.locals.pretty = true;

/**
 * Handle /404 
 */
app.get('/404', function(req, res) {
  res.statusCode = 404;
  res.send('Not Found');
});

/**
 * Handle /about
 */
app.get('/about', function(req, res) {
  res.statusCode = 200;
  res.render('impressum', {title: 'Impressum von pegel.JETZT'});
});

app.get('/:location', function(req, res) {
  res.send(req.params.location);
  // Hamburg.get(function() {
  //  console.log(argument);
  // });
  // res.send('1');
  /* Pegel.get(req.params.location, function(err, data) {
    if (err) {
      res.send('Location unavailable');
      // res.redirect('/404');
    } else {
      res.render('location');
    }
  }); */
});

/**
 * Index - Redirect to default
 */
app.get('/hamburg', function(req, res) {
  /* var location = mapping['hamburg'];
  Pegel.get(location, function(data) {
    var response = {
      title: "Aktueller Pegelstand der Elbe in " + location.label,
      location: true,
      name: location.name,
      label: location.label,
      geo: location.geo,
      river: location.river,
      data: data,
      format_time: function(h, m) {
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
      }
    };
    
    res.render('location', response);
  }); */  
});


/**
 * Start Express.js
 */
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
