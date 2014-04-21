define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){

    var GlobalView = Backbone.View.extend({

        search : function(el){
            el.on("click", "a", function(e){
                e.preventDefault();
                e.stopPropagation();
                $(e.delegateTarget).toggleClass("open");
            });
            el.on("click", "input", function(e){
                e.stopPropagation();
            });
            $(document).on("click", function(e){
                el.removeClass("open");
            });
        },

        dropdown : function(el) {
            el.on("click mouseleave", ".expander", function(e){
                var $this = $(this);
                if(e.type == "mouseleave") $this.find("ul").addClass("inactive");
                else $this.find("ul").toggleClass("inactive");
            });
            var getItem = function(el){
                if(el.find(".expander ul li .selected").length > 0) return el.find(".expander ul li .selected").text();
                else return "";
            };
            return {
                getItem : getItem
            };
        },

        render : function(){
            var that = this;
            $(function(){

                that.search($("#nycg-search"));

                var sortDrop = { el : $("#dropdown-sort") }
                sortDrop.obj = new that.dropdown(sortDrop.el);
                sortDrop.val = sortDrop.obj.getItem(sortDrop.el);
                sortDrop.el.find("ul").on("click", "li", function(e){
                    var $this = $(this);
                    if(!$this.hasClass("nycg-zip-sort")) {
                        $this.siblings().removeClass("selected");
                        $this.addClass("selected");
                        sortDrop.val = $this.text();
                        $this.parents(".expander").children("p").find("span").html(sortDrop.val);
                    } else {
                        e.stopPropagation();
                    }
                });

                $(".msg.msg-err").on("click", "a", function(e){
                    $(e.delegateTarget).addClass("msg-up");
                    e.preventDefault();
                    e.stopPropagation();
                });

            });
        }

    });

    return GlobalView;

});