define([
    'jquery',
    'views/global',
    'models/infinite-scroll',
    'views/infinite-scroll/list'
], function($, GlobalView, InfiniteScrollModel, InfiniteScrollView){

    var detectBottom = function(threshold, callback) {
        window.onscroll = function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - threshold) {
                callback();
            }
        };
    };

    var initialize = function(){

        // globals
        var globalView = new GlobalView();
        globalView.render();

        // infinite scroll
        var infiniteScroll = (NYCG.infiniteScroll.status) ? new detectBottom(200, function(){ 
            if(NYCG.infiniteScroll.status && !NYCG.infiniteScroll.isLoading) { 
              var infiniteScrollModel = new InfiniteScrollModel,
                infiniteScrollView = new InfiniteScrollView({ el: $(NYCG.infiniteScroll.selector), model : infiniteScrollModel });
              infiniteScrollView.render();
            }
        }) : false;

    };

    return {
        initialize: initialize
    };

});