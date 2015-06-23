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

  function enjoListener(that, params, eventName) {
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
        $(that).trigger("enjo-model-update", params);
      }
    };
    return binder;
  }

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

    that.bindParams = enjoListener(that, params, "enjo-model-update");

    return that;
  };

  enjo.viewModel = function(model) {
    var that = {};

    that.init = function(onUpdate) {
      $(model).on("enjo-model-update", onUpdate);
    };

    that.bindParams = enjoListener(that, params, "enjo-view-model-update");
    return that;
  };

  enjo.view = function(viewModel) {
    var that = {};

    that.init = function(onUpdate) {
      $(viewModel).on("enjo-view-model-update", onUpdate);
    };
          // params[paramName].$view.val(newValue);
          // $(params[paramName].$view).trigger("change");
    // initializeBindParams(params, binder);
    // function isValue(param) {
    //   return param.hasOwnProperty("$view") &&
    //          param.hasOwnProperty("value");
    // }
    //
    // function isEvent(param) {
    //   return param.hasOwnProperty("$view") &&
    //          param.hasOwnProperty("event") &&
    //          param.hasOwnProperty("callback");
    // }
    //
    // function initializeBindParams(params, binder) {
    //   Object.keys(params).forEach(function(key) {
    //     // bind properties each of which has $view property only
    //     var param = params[key];
    //
    //     if (isValue(param)) {
    //       initializeValue(param);
    //     } else if(isEvent(param)) {
    //       initializeEvent(param, binder);
    //     }
    //   });
    // }
    //
    // function initializeValue(param) {
    //   // initialize value
    //   param.$view.val(param.value);
    //
    //   // register change events
    //   param.$view.on("change", function() {
    //     param.value = param.$view.val();
    //   });
    // }

    // function initializeEvent(param, binder) {
    //   // register events
    //   param.$view.on(param.event, function(e){
    //     param.callback(e, binder);
    //   });
    // }

    return that;
  };

  return enjo;
});
