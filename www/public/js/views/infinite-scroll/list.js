define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/photos/list.html'
], function($, _, Backbone, InfiniteScrollTemplate){
    var InfiniteScrollView = Backbone.View.extend({
        template: _.template(InfiniteScrollTemplate),
        render: function(){
            var that = this;
            APP.isLoading = true;
            this.$el.addClass("loading"); // show preloader
            this.model.fetch({
              success: function (result) {
                  var obj = result.toJSON();
                  if(_.isEmpty(obj)) // if we've gotten all results, stop making the requests
                      APP.infiniteScroll = false;
                  else that.$el.append( that.template({ obj: obj, _:_ }) ); // else underscore templating
                  APP.isLoading = false;
                  that.$el.removeClass("loading"); // hide preloader
              }
            });
        }
    });
    return InfiniteScrollView;
});