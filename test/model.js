describe("Model", function() {
  "use strict";
  var assert = chai.assert;

  var enjoM, model;

  beforeEach(function(){
    enjoM = enjo($).Model();
    model = (function(enjoM) {
      var that = {};
      that.fire = enjoM.bindParams(that, {
        values: [1, 2, 3]
      });
      return that;
    }(enjoM));
  });

  it("can get binded params", function() {
    assert.equal(model.fire.get("values").length, [1, 2, 3].length);
  });

  it("can set binded params", function() {
    model.fire.set("values", [2, 3]);
    assert.equal(model.fire.get("values").length, [2, 3].length);
  });

  it("trigger an event", function() {
    var spy = sinon.spy();
    $(model).on("enjo-update", function(e, data) {spy(data);});
    model.fire.set("values", [2, 3]);
    assert(spy.calledWith({values: [2, 3]}));
  });

  it("will not trigger an event when same value setted", function() {
    var spy = sinon.spy();
    $(model).on("enjo-update", function(e, data) {spy(data);});
    model.fire.set("values", [1, 2, 3]);
    assert(spy.notCalled);
  });
});
