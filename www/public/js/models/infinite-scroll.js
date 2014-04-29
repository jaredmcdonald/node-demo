define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var InfiniteScrollModel = Backbone.Model.extend({

    initialize: function(options){
      this.options = options;
    },

    url: function(){
        console.log(APP.restUrl + '/photos/' + this.options.d + '/' + this.options.limit);
        return APP.restUrl + '/photos/' + this.options.d + '/' + this.options.limit;
    }
    
  });

  return InfiniteScrollModel;

});