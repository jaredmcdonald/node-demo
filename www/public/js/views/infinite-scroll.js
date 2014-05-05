define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/photos/list.html'
], function($, _, Backbone, InfiniteScrollTemplate){

  var InfiniteScrollView = Backbone.View.extend({

    initialize: function(options) {
      this.options = options.viewOptions;
    },

    template: _.template(InfiniteScrollTemplate),

    render: function(){
      console.log("our view model below:");
      console.log(this.model);
      var obj = this.model.toJSON();
      console.log("our view model as an object below:");
      console.log(obj);
      if(this.model.has(0) ) { // if we have results do underscore templating
        console.log("exists");
        console.log(obj);
        this.$el.append( this.template({ obj: obj, _:_ }) );
      } else { // else stop from making more requests
        APP.infiniteScroll = false;
      }
      APP.isLoading = false;
      this.$el.removeClass("loading");
    }

  });

  return InfiniteScrollView;
  
});