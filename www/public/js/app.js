define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'collections/infinite-scroll',
  'views/infinite-scroll'
], function($, _, Backbone, AppRouter, InfiniteScroll, InfiniteScrollView){

  // Infinite scroll DOM element string identifier
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
      var expireDate = new Date(new Date().getTime() + (storageExpireTime * 60000));
      localStorage.setItem('photoAddTime', expireDate);

      // Tell our app that we're loading a model
      APP.isLoading = true;
      $(el).addClass("loading");

      // This object is used for the model and view. We're reading
      // the most recently added DOM item to retrieve the date
      // associated with the item.
      var options = {
        date : $(el + " section").length ? escape($(el + " section:last").attr("data-date")) : escape(new Date()),
        limit : 5
      };

      // Instantiate a new model an pass in the options above.
      // Add the model to the collection, and listen for that change.
      // Handle the change by creating a new view.
      var infiniteScrollModel = new InfiniteScroll.Model(options);
      collection.add(infiniteScrollModel);
      collection.listenToOnce(collection, 'change', function(){ 
        var newView = new RenderView(collection.models[collection.length - 1], options);
        // Since the response from the request has now been stored we
        // tell our app loading is complete
        APP.isLoading = false;
        $(el).removeClass("loading");
        // Add an entry in browsing history.
        router.navigate("#/page/" + collection.length, {trigger:false});
      });

    }

  };

  // Instantiate a new view based on "model" and "options"
  var RenderView = function(model, options) {

    var infiniteScrollView = new InfiniteScrollView({ el: $(el), model : model, viewOptions : options });
    infiniteScrollView.render();

  }

  // Instantiate a collection
  var NewCollection = function() {

    // Instantiate a new collection and fetch for existence of models
    var infiniteScrollCollection = new InfiniteScroll.Collection();
    infiniteScrollCollection.fetch({ success : onDataHandler, error: onErrorHandler });

  }

  // Bind scroll event
  // When scrolled to bottom if we're not loading a model and
  // if infinite scroll is still enabled - instantiate a new item.
  var ScrollHandler = function(collection) {

    window.onscroll = function() {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150) {
        if(!APP.isLoading && APP.infiniteScroll) {
          var newItem = new Item(appRouter, collection, false);
        }
      }
    };

  };

  // Check the passed "collection" to detect whether it's already
  // populated and assign that boolean value to "stored" which is
  // passed to a new item instance.
  var onDataHandler = function(collection, response, options) {

    var stored = false;

    // If collection has models
    if(collection.length > 0) {

      var time = new Date();
      var expireTime = new Date(localStorage.getItem('photoAddTime'));

      // If the current time is later than expire time - reset and return
      if(expireTime < time) {

        window.localStorage.clear();
        var newCollection = new NewCollection();
        // return out of the function
        return;

      } else { // Else set a variable identifying that we have local storage

        stored = true;

      }

    }

    // instantiate a new item (list) and scroll handler with our collection
    var scrollHandler = new ScrollHandler(collection);
    var item = new Item(appRouter, collection, stored);

  };

  // Handle error
  var onErrorHandler = function(collection, response, options) {
    console.log('response error is: ' + response.responseText);
  };

  // Start it up!
  var initialize = function(){

    // In certain situations we want to clear local storage
    if(APP.clearStorage) {

      window.localStorage.clear();

    }

    // If we're on a page that wants infinite scroll
    if(APP.infiniteScroll) {

      // Monitor hash change events
      Backbone.history.start();
      // Instantiate a new collection
      var newCollection = new NewCollection(false);

    }

  };

  return {
    initialize: initialize
  };

});