// Global settings
var APP = window.APP || {};
APP.restUrl = "http://localhost:3000/api";

// Require paths and dependencies
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.11.0.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    localStorage: 'libs/localstorage/backbone.localStorage'
  },
  shim: { 
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    localStorage: {
      deps: ['backbone']
    }
  }
});

// Start the app!
require(['app'], function(App){
	App.initialize();
});