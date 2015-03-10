(function() {
  var http = require('http');
  var express = require('express');
  var path = require('path');
  var logger = require('morgan');
  var lessMiddleware = require('less-middleware');
  var app = express();
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  
  app.use(logger('dev'));
  app.use(lessMiddleware(__dirname + '/public', {compress: false}));
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Configure routes
  app.use('/', require('./routes.js'));
  
  // Create Express.js HTTP app
  var server = http.createServer(app);
  exports = module.exports = server;
  
  // Export handler for using grunt-express
  exports.use = function() {
    app.use.apply(app, arguments);
  };
})();