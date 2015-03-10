module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  grunt.initConfig({
    jshint: {
      all: {
        src: [
          'lib/*.js',
          'routes.js',
          'test/*.js',
          'locations/*.js'
        ],
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        grep: '',
        ui: 'tdd',
        reporter: 'spec'
      },
      all: { src: ['test/**/*.js'] }
    },
    watch: {
      scripts: {
        files: [
          '.jshintrc',
          'Gruntfile.js',
          'lib/*.js',
          'routes.js',
          'test/*.js',
          'locations/*.js'
        ],
        tasks: ['simplemocha', 'jshint'],
        options: {
          interrupt: true,
        },
      },
    },
    express: {
      defaults: {
          options: {
            server: 'app.js',
            port: 8080,
            verbose: true
          }
      }
    }
  });

  // For this to work, you need to have run `npm install grunt-simple-mocha`
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-express');

  // Default task
  grunt.registerTask('default', ['jshint']);

  // Run tests
  grunt.registerTask('test', ['simplemocha']);

  // Run JSHint
  grunt.registerTask('lint', ['jshint']);

  // Express server
  grunt.registerTask('server', ['express', 'express-keepalive']);

};