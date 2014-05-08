define([
  'underscore',
  'backbone',
  'localStorage'
], function(_, Backbone){

  // Setup our model
  var InfiniteScrollModel = Backbone.Model.extend({

    // Constructor
    initialize: function(options){

      // Receive passed options and set them on the model
      var that = this;
      this.options = options;

      var onDataHandler = function(model, response, options) {
        // Save our model to local storage - otherwise this would result
        // in a post request on the server.
        that.save();
      };

      var onErrorHandler = function(collection, response, options) {
        console.log('response error is: ' + response.responseText);
      };

      // Fetch the data via our RESTful endpoint (url)
      this.fetch({ success : onDataHandler, error: onErrorHandler });

    },

    url: function(){

      console.log("model url is: " + APP.restUrl + '/photos/' + this.options.date + '/' + this.options.limit);
      return APP.restUrl + '/photos/' + this.options.date + '/' + this.options.limit;

    }

  });

  // Setup our collection
  var InfiniteScrollCollection = Backbone.Collection.extend({

    model: InfiniteScrollModel,
    localStorage: new Backbone.LocalStorage("infiniteScrollModel")

  });

  return {

    Model : InfiniteScrollModel,
    Collection : InfiniteScrollCollection

  };

});