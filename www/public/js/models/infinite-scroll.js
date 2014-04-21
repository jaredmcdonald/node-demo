define([
  'jquery', // TODO: figure out a way to do this without the dom
  'underscore',
  'backbone'
], function($, _, Backbone){
  var InfiniteScrollModel = Backbone.Model.extend({
    url: function(){
        console.log(NYCG.infiniteScroll.url + '/' + NYCG.infiniteScroll.ns + '/' + escape($(NYCG.infiniteScroll.selector + " section:last").attr("data-date")) + '/' + NYCG.infiniteScroll.limit);
        return NYCG.infiniteScroll.url + '/' + NYCG.infiniteScroll.ns + '/' + escape($(NYCG.infiniteScroll.selector + " section:last").attr("data-date")) + '/' + NYCG.infiniteScroll.limit;
    }
  });
  return InfiniteScrollModel;
});