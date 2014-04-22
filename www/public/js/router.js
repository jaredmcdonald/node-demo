define([
	'jquery',
	'models/infinite-scroll',
	'views/infinite-scroll/list'
], function($, InfiniteScrollModel, InfiniteScrollView){

	var detectBottom = function(threshold, callback) {
		window.onscroll = function() {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - threshold) {
				callback();
			}
		};
	};

	var initialize = function(){

		var initInfiniteScroll = function(){
			var infiniteScrollModel = new InfiniteScrollModel;
			var infiniteScrollView = new InfiniteScrollView({ el: $(".infinite-scroll"), model : infiniteScrollModel });
			infiniteScrollView.render();
		};

		var infiniteScroll = new detectBottom(200, function(){
			if(!APP.isLoading && APP.infiniteScroll) {
				var newInfiniteScrolled = new initInfiniteScroll();
			}
		});

		var newInfiniteScroll = new initInfiniteScroll();

	};

	return {
		initialize: initialize
	};

});