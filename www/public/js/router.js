define([
	'jquery',
	'models/infinite-scroll',
	'views/infinite-scroll/list'
], function($, InfiniteScrollModel, InfiniteScrollView){

	var initialize = function(){

		var asyncItems = function(){
			var options = {
				d : $(".infinite-scroll section").length ? escape($(".infinite-scroll section:last").attr("data-date")) : escape(new Date()),
				limit : 5 // number of items to append
			};
			var infiniteScrollModel = new InfiniteScrollModel( options );
			var infiniteScrollView = new InfiniteScrollView({ el: $(".infinite-scroll"), model : infiniteScrollModel, viewOptions : options });
			infiniteScrollView.render();
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