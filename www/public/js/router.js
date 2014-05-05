define([
	'jquery',
	'underscore',
  'backbone',
  'collections/infinite-scroll',
  'views/infinite-scroll/list'
], function($, _, Backbone, InfiniteScroll, InfiniteScrollView){

  var AppRouter = Backbone.Router.extend({
    //routes: {
      //"page/:number": "showPhotos"
    //}
  });

  var Item = function(a, c, stored){ // create a new item list

    if(!stored) { // if we don't already have it in local storage

      console.log("was not stored");

      var options = {
        d : $(".infinite-scroll section").length ? escape($(".infinite-scroll section:last").attr("data-date")) : escape(new Date()),
        limit : 5 // number of items to append
      };

      var infiniteScrollModel = new InfiniteScroll.Model( options );
      c.add(infiniteScrollModel);

      var renderView = function(){
        var infiniteScrollView = new InfiniteScrollView({ el: $(".infinite-scroll"), model : c.models[c.length - 1], viewOptions : options });
        infiniteScrollView.render();
      };

      c.listenToOnce(c, 'change', renderView);

    } else { // we have it in local storage

      console.log("was stored");

      _(c.models).each(function(m) {
        console.log("model below from local storage:");
        console.log(m);
        var infiniteScrollView = new InfiniteScrollView({ el: $(".infinite-scroll"), model : m, viewOptions : m.options });
        infiniteScrollView.render();
      });

    }

    // handle routing
    a.navigate("#/page/" + c.length, {trigger:false});

  };

	var initialize = function(){

    var appRouter = new AppRouter();
    Backbone.history.start();

    var onDataHandler = function(collection, response, options) {
      console.log("collection data success... collection below:");
      console.log(collection);
      var stored = (collection.length > 0) ? true : false;
      var item = new Item(appRouter, collection, stored);
    };

    var onErrorHandler = function(collection, response, options) {
      console.log('response error is: ' + response.responseText);
    };

    var infiniteScrollCollection = new InfiniteScroll.Collection();
    infiniteScrollCollection.fetch({ success : onDataHandler, error: onErrorHandler });

		window.onscroll = function() {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150) {
				if(!APP.isLoading && APP.infiniteScroll) {
					var newItem = new Item(appRouter, infiniteScrollCollection, false);
				}
			}
		};

	};

	return {
		initialize: initialize
	};

});