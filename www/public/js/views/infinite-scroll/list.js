NYCG.infiniteScroll.ns = (typeof NYCG.infiniteScroll.ns != 'undefined') ? NYCG.infiniteScroll.ns : 'empty' ;

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/' + NYCG.infiniteScroll.ns + '/list.html'
], function($, _, Backbone, InfiniteScrollTemplate){
    var InfiniteScrollView = Backbone.View.extend({
        template: _.template(InfiniteScrollTemplate),
        render: function(){
            var that = this;
            NYCG.infiniteScroll.isLoading = true;
            this.$el.addClass("loading"); // show preloader
            this.model.fetch({
              success: function (result) {
                  // an object with the items and view helper/s for underscore
                  var obj = {
                      items: result.toJSON(),
                      viewHelpers : {
                          removeHTML: function(str){
                              var stripped = str.replace(/(<([^>]+)>)/ig,"");
                              return stripped;
                          }
                      }
                  };
                  if(_.isEmpty(obj.items)) // if we've gotten all results, stop making the requests
                      NYCG.infiniteScroll.status = false;
                  else that.$el.append( that.template({ obj: obj, _:_ }) ); // else underscore templating
                  NYCG.infiniteScroll.isLoading = false;
                  that.$el.removeClass("loading"); // hide preloader
              }
            });
        }
    });
    return InfiniteScrollView;
});