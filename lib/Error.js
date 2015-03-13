(function() {
  'use strict';
  
  var Error = function(message, code, data) {
    this.message = message;
    this.code = code;
    this.data = data || {};
  };
  
  module.exports = exports = Error;
})();