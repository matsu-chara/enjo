describe("Repository", function() {
  "use strict";
  var assert = chai.assert;

  var enjoR;

  beforeEach(function(){
    enjoR = enjo($).repository();
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
    enjoR.getRequest("dummy/", done, fail);

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
    enjoR.postRequest("dummy/", null, done, fail);

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
    enjoR.deleteRequest("dummy/", null, done, fail);

    assert(stub.called);
    assert(done.called);
    assert(fail.notCalled);
  });
});
