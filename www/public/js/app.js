define([
  'jquery',
  'router'
], function($, Router){

  var initialize = function(){
    APP.isLoading = false;
    APP.infiniteScroll = true;
    APP.restUrl = "http://local.adam.com:3000/api";
    Router.initialize();
  };

  return {
    initialize: initialize
  };

});