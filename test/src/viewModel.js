describe("ViewModel", function() {
  "use strict";
  var assert = chai.assert;

  var viewModel, enjoVm, model;

  describe("Binded Values", function(){
    var $text;
    beforeEach(function(){
      model = {};
      enjoVm = enjo($).viewModel();

      // simulated jquery input
      $text = {
        val: function(v) {
          if (typeof v === "undefined") {
            return this.value;
          } else {
            this.value = v;
            if(this.callback !== null) {
              this.callback();
            }
          }
        },
        value : "foo",
        on: function(e, callback){
          if (e === "change") {
            this.callback = callback;
          }
        },
        callback: null
      };

      viewModel = (function() {
        var that = {};
        that.fire = enjoVm.bindParams({
          text: {
            $view: $text,
            value: "foo"
          }
        });
        return that;
      }());
    });

    it("listen event when model changed", function() {
      var spy = sinon.spy();
      enjoVm.init(model, spy);
      $(model).trigger('enjo-update');
      assert(spy.called);
    });

    it("change view when params changed", function() {
      viewModel.fire.set("text", "bar");
      assert.equal(viewModel.fire.get("text"), "bar");
      assert.equal($text.value, "bar");
    });

    it("change view when params changed", function() {
      $text.val("baz");
      assert.equal($text.val(), "baz");
      assert.equal(viewModel.fire.get("text"), "baz");
    });
  });

  describe("Binded Events", function(){
    var $button;
    beforeEach(function(){
      model = {};
      enjoVm = enjo($).viewModel();

      // simulated jquery input
      $button = {
        on: function(e, callback){
          this.callback = callback;
        },
        callback: null,
        trigger: function(e) {
          if(e === "click") {
            this.callback();
          }
        }
      };
    });

    it("call callback when clicked", function() {
      var spy = sinon.spy();

      viewModel = (function() {
        var that = {};
        that.fire = enjoVm.bindParams({
          button: {
            $view: $button,
            event: "click",
            callback: spy
          }
        });
        return that;
      }());
      $button.trigger("click");

      assert(spy.called);
    });

  });
});
