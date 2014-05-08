define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/photos/list.html'
], function($, _, Backbone, InfiniteScrollTemplate){

  // Setup our view
  var InfiniteScrollView = Backbone.View.extend({

    // Constructor
    initialize: function(options) {

      // Receive passed options and set them on the view
      this.options = options.viewOptions;

    },

    // Underscore template
    template: _.template(InfiniteScrollTemplate),

    render: function(){

      var obj = this.model.toJSON();

      // If we have results do underscore templating
      // Else stop from making more requests
      if(this.model.has(0) ) {

        this.$el.append( this.template({ obj: obj, _:_ }) );

      } else {

        APP.infiniteScroll = false;

      }
      
    }

  });

  return InfiniteScrollView;
  
});