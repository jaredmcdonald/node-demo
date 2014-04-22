define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/photos/list.html'
], function($, _, Backbone, InfiniteScrollTemplate){
  var InfiniteScrollView = Backbone.View.extend({
    template: _.template(InfiniteScrollTemplate),
    render: function(){
      var that = this;
      APP.isLoading = true;
      this.$el.addClass("loading");
      this.model.fetch({
        success: function (result) {
          var obj = result.toJSON();
          // if we've gotten all results, stop making the requests
          if(_.isEmpty(obj)) APP.infiniteScroll = false;
          else that.$el.append( that.template({ obj: obj, _:_ }) ); // else underscore templating
          APP.isLoading = false;
          that.$el.removeClass("loading");
        }
      });
    }
  });
  return InfiniteScrollView;
});