define([
  'jquery', // TODO: do this without the dom
  'underscore',
  'backbone'
], function($, _, Backbone){
  var InfiniteScrollModel = Backbone.Model.extend({
    url: function(){
        var d = $(".infinite-scroll section").length ? $(".infinite-scroll section:last").attr("data-date") : new Date();
        console.log(APP.restUrl + '/photos/' + escape(d) + '/5');
        return APP.restUrl + '/photos/' + escape(d) + '/5';
    }
  });
  return InfiniteScrollModel;
});