define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'collections/infinite-scroll',
  'views/infinite-scroll'
], function($, _, Backbone, AppRouter, InfiniteScroll, InfiniteScrollView){

  // Infinite scroll dom element string identifier
  var el = ".infinite-scroll";
  // Instantiate the router
  var appRouter = new AppRouter;
  // Time in minutes to clear local storage
  var storageExpireTime = 15;

  // Based on boolean "stored" argument - retrieves either the
  // collection from local storage and outputs a presentation or
  // creates an instance of a model and stores it to the passed in 
  // collection. A listener handles the change event of the collection
  // and renders the view.
  var Item = function(router, collection, stored){

    // If we have it in local storage
    if(stored) {

      // Iterate over the collection and append a view for each
      _(collection.models).each(function(model) {
        var newView = new RenderView(model, model.options);
      });

    } else { // Create a new one

      // Store the time we are adding to local storage
      var time = new Date().toString();
      localStorage.setItem('photoAddTime', time);

      // Tell our app that we're loading a model
      APP.isLoading = true;
      $(el).addClass("loading");

      // This object is used for the model and view
      var options = {
        date : $(el + " section").length ? escape($(el + " section:last").attr("data-date")) : escape(new Date()),
        limit : 5
      };

      // Instantiate a new model an pass in the options above.
      // Add the model to the collection, and listen for that change.
      // Handle the change by creating a new view
      var infiniteScrollModel = new InfiniteScroll.Model(options);
      collection.add(infiniteScrollModel);
      collection.listenToOnce(collection, 'change', function(){ 
        var newView = new RenderView(collection.models[collection.length - 1], options);
        // Since the response from the request has now been stored we
        // tell our app loading is complete
        APP.isLoading = false;
        $(el).removeClass("loading");
      });

    }

    // Add an entry in browsing history.
    router.navigate("#/page/" + ((collection.length <= 1) ? 1 : (collection.length - 1)), {trigger:false});

  };

  // Instantiate a new view based on "model" and "options"
  var RenderView = function(model, options) {
    var infiniteScrollView = new InfiniteScrollView({ el: $(el), model : model, viewOptions : options });
    infiniteScrollView.render();
  }

  // Check the passed "collection" to detect whether it's already
  // populated and assign that boolean value to "stored" which is
  // passed to a new item instance.
  var onDataHandler = function(collection, response, options) {
    if(collection.length > 0) {
      var time = new Date();
      var expireTime = new Date(localStorage.getItem('photoAddTime'));
      console.log("time: " + time);
      console.log("stored time: " + expireTime);
      console.log(expireTime < time);
      if(expireTime < time) {
        var stored = false;
        window.localStorage.clear();
      } else {
        var stored = true;
      }
    }
    var item = new Item(appRouter, collection, stored);
  };

  // Handle error
  var onErrorHandler = function(collection, response, options) {
    console.log('response error is: ' + response.responseText);
  };

  // Start it up!
  var initialize = function(){

    // Add definitions to the global "APP" object
    APP.isLoading = false;
    APP.infiniteScroll = true;
    APP.restUrl = "http://localhost:3000/api";

    // Monitor hash change events
    Backbone.history.start();

    // Instantiate a new collection and fetch for existence of models
    var infiniteScrollCollection = new InfiniteScroll.Collection();
    infiniteScrollCollection.fetch({ success : onDataHandler, error: onErrorHandler });

    // When scrolled to bottom if we're not loading a model and
    // if infinite scroll is still enabled - instantiate a new item.
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