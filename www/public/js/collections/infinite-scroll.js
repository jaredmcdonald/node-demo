define([
  'underscore',
  'backbone',
  'localStorage'
], function(_, Backbone){

  var InfiniteScrollModel = Backbone.Model.extend({

    initialize: function(options){

      var that = this;
      this.options = options;

      var onDataHandler = function(model, response, options) {
        //console.log("our model's model below:");
        //console.log(model);
        //console.log("our model's response below");
        //console.log(model);
        that.save();
      };

      var onErrorHandler = function(collection, response, options) {
        console.log('response error is: ' + response.responseText);
      };

      this.fetch({ success : onDataHandler, error: onErrorHandler });

    },

    url: function(){
      console.log("model url is: " + APP.restUrl + '/photos/' + this.options.d + '/' + this.options.limit);
      return APP.restUrl + '/photos/' + this.options.d + '/' + this.options.limit;
    }

  });

  var InfiniteScrollCollection = Backbone.Collection.extend({
    model: InfiniteScrollModel,
    localStorage: new Backbone.LocalStorage("inf")
  });

  return {
    Model : InfiniteScrollModel,
    Collection : InfiniteScrollCollection
  };

});