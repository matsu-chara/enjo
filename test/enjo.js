describe("enjo", function() {
  "use strict";
  var assert = chai.assert;

  it("is initializable", function() {
    assert.notEqual(enjo($), undefined);
  });

  describe("Repository", function() {
    var enjoR;

    beforeEach(function(){
      enjoR = enjo($).Repository();
    });

    afterEach(function () {
      $.ajax.restore();
    });

    it("makes a GET request", function() {
      var stub = sinon.stub($, "ajax");
      stub.returns((function (){
          var d = $.Deferred();
          d.resolve([]);
          return d.promise();
      }()));

      var done = sinon.spy();
      var fail = sinon.spy();
      enjoR.get("dummy/", done, fail);

      assert(stub.called);
      assert(done.called);
      assert(fail.notCalled);
    });


    it("makes a POST request", function() {
      var stub = sinon.stub($, "ajax");
      stub.returns((function (){
          var d = $.Deferred();
          d.resolve([]);
          return d.promise();
      }()));

      var done = sinon.spy();
      var fail = sinon.spy();
      enjoR.post("dummy/", null, done, fail);

      assert(stub.called);
      assert(done.called);
      assert(fail.notCalled);
    });

    it("makes a DELETE request", function() {
      var stub = sinon.stub($, "ajax");
      stub.returns((function (){
          var d = $.Deferred();
          d.resolve([]);
          return d.promise();
      }()));

      var done = sinon.spy();
      var fail = sinon.spy();
      enjoR.delete("dummy/", null, done, fail);

      assert(stub.called);
      assert(done.called);
      assert(fail.notCalled);
    });
  });
});
