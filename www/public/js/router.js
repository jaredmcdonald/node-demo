define([
	'jquery',
	'underscore',
  'backbone',
  'localstorage',
	'models/infinite-scroll',
	'views/infinite-scroll/list'
], function($, _, Backbone, LocalStorage, InfiniteScrollModel, InfiniteScrollView){

	var AppRouter = Backbone.Router.extend({
	  routes: {
			"page/:number": "showPhotos"
	  }
	});

	var PhotoCollection = Backbone.Collection.extend({
		model: InfiniteScrollModel,
		//localStorage: new LocalStorage("PhotoCollection")
  });

  var photoCollection = new PhotoCollection();

	var initialize = function(){

		// Instantiate the router
		var appRouter = new AppRouter;
		var i = 1;
		appRouter.on('route:showPhotos', function (n) {
		  console.log( "page " + n);   
		});
		Backbone.history.start();

		// instantiate collection

		var asyncItems = function(){

			var options = {
				d : $(".infinite-scroll section").length ? escape($(".infinite-scroll section:last").attr("data-date")) : escape(new Date()),
				limit : 5 // number of items to append
			};

			// create the model and pass it to the view
			var infiniteScrollModel = new InfiniteScrollModel( options );
			// add model to the collection
			photoCollection.add(infiniteScrollModel);
			console.log(photoCollection);
			var infiniteScrollView = new InfiniteScrollView({ el: $(".infinite-scroll"), model : photoCollection.models[i-1], viewOptions : options });
			infiniteScrollView.render();

			// handle routing
			appRouter.navigate("#/page/" + i, {trigger:false});
			i++;

		};
		
		window.onscroll = function() {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150) {
				if(!APP.isLoading && APP.infiniteScroll) {
					var newItems = new asyncItems();
				}
			}
		};

		var items = new asyncItems();

	};

	return {
		initialize: initialize
	};

});