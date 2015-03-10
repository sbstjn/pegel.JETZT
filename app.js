(function() {
  var http = require('http');
  var express = require('express');
  var path = require('path');
  var lessMiddleware = require('less-middleware');
  var Error = require('./lib/Error.js');
  var app = express();
  var opbeat = require('opbeat')({
    appId: '5178715c70',
    organizationId: 'a0e689c14693414a9001d403fe1a23c2',
    secretToken: '85af1b548c26415413a2b7606ea359e50f4beb64'
  });
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  
  app.use(lessMiddleware(__dirname + '/public', {compress: false}));
  app.use(express.static(path.join(__dirname, 'public')));

  // Display 404 error page
  app.get('/404', function(req, res) {
    res.statusCode = 404;
    res.send('Not Found');
  });
  
  // Display 500 error page
  app.get('/500', function(req, res) {
    res.statusCode = 500;
    res.send('Server Error');
  });

  // Configure routes
  app.use('/', require('./routes.js'));
  
  // Catch errors
  app.use(function(err, req, res, next) {
    // Send Error to OpBeat
    opbeat.captureError(err.message, {
      extra: {location: err.data.location}, 
      request: req});
    
    // Redirect to error page
    res.redirect('/' + err.code ? err.code : 500);
  });
  
  // Create Express.js HTTP app
  var server = http.createServer(app);
  exports = module.exports = server;
  
  // Export handler for using grunt-express
  exports.use = function() {
    app.use.apply(app, arguments);
  };
})();