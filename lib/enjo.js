/*
 * === MVVM Framework enjo.js ===
 */
(function(definition){
  if (typeof exports === "object") {
    // CommonJS
    module.exports = definition;
  } else {
    // <script>
    enjo = definition;
  }
})(function($){
  "use strict";
  var enjo = {};

  enjo.repository = function() {
    var that = {};

    that.getRequest = function(path, done, fail) {
      var defaultFail = function(xhr, status, err) {
        console.error("get request failed." + " err: " + err);
      };
      fail = (typeof fail !== "undefined")? fail : defaultFail;

      $.ajax({
        type: "GET",
        url: path,
        dataType: 'json'
      }).then(done, fail);
    };

    that.postRequest = function(path, data, done, fail) {
      var defaultFail = function(xhr, status, err) {
        console.error("post request failed." +
                      " data: " + JSON.stringify(data) + " err: " + err);
      };
      fail = (typeof fail !== "undefined")? fail : defaultFail;

      $.ajax({
        type: "POST",
        url: path,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json'
      }).then(done, fail);
    };

    that.deleteRequest = function(path, data, done, fail) {
      var defaultFail = function(xhr, status, err) {
        console.error("delete request failed." +
                      " data: " + JSON.stringify(data) + " err: " + err);
      };
      fail = (typeof fail !== "undefined")? fail : defaultFail;

      $.ajax({
        type: "DELETE",
        url: path
      }).then(done, fail);
    };

    return that;
  };

  enjo.model = function() {
    var that = {};

    that.bindParams = function(model, params) {
      var binder = {
        get: function(paramName) {
          return params[paramName];
        },
        set: function(paramName, newValue) {
          // do nothing, if there is no change.
          if(JSON.stringify(params[paramName]) ===
             JSON.stringify(newValue)) {
            return;
          }

          params[paramName] = newValue;
          $(model).trigger("enjo-update", params);
        }
      };
      return binder;
    };

    return that;
  };

  enjo.viewModel = function() {
    var that = {};

    that.init = function(model, onUpdate) {
      $(model).on("enjo-update", onUpdate);
    };

    that.bindParams = function(params) {
      var binder = {
        get: function(paramName) {
          return params[paramName].value;
        },
        set: function(paramName, newValue) {
          params[paramName].value = newValue;
          params[paramName].$view.val(newValue);
          $(params[paramName].$view).trigger("change");
        }
      };
      initializeBindParams(params, binder);
      return binder;
    };

    function isValue(param) {
      return param.hasOwnProperty("$view") &&
             param.hasOwnProperty("value");
    }

    function isEvent(param) {
      return param.hasOwnProperty("$view") &&
             param.hasOwnProperty("event") &&
             param.hasOwnProperty("callback");
    }

    function initializeBindParams(params, binder) {
      Object.keys(params).forEach(function(key) {
        // bind properties each of which has $view property only
        var param = params[key];

        if (isValue(param)) {
          initializeValue(param);
        } else if(isEvent(param)) {
          initializeEvent(param, binder);
        }
      });
    }

    function initializeValue(param) {
      // initialize value
      param.$view.val(param.value);

      // register change events
      param.$view.on("change", function() {
        param.value = param.$view.val();
      });
    }

    function initializeEvent(param, binder) {
      // register events
      param.$view.on(param.event, function(e){
        param.callback(e, binder);
      });
    }

    return that;
  };

  return enjo;
});
