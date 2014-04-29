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
      var that = this;
      APP.isLoading = true;
      this.$el.addClass("loading");
      this.model.fetch({
        success: function (result) {
          var obj = {
            items : result.toJSON(),
            limit : that.options.limit
          };
          if(obj.items.hasOwnProperty(0)) // if we have results do underscore templating
            that.$el.append( that.template({ obj: obj, _:_ }) );
          else // else stop from making more requests
            APP.infiniteScroll = false;
          APP.isLoading = false;
          that.$el.removeClass("loading");
        }
      });
    }

  });

  return InfiniteScrollView;
  
});