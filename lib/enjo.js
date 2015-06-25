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

  // private vars
  var ENJO_EVENT_MODEL_UPDATE      = "enjo-model-update";
  var ENJO_EVENT_VIEW_MODEL_UPDATE = "enjo-view-model-update";

  var util = {};
  // trigger event when parms changed.
  util.enjoListener = function(that, eventName, params) {
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
        $(that).trigger(eventName, params);
      }
    };
    return binder;
  };

  enjo.repository = function() {
    var that = {};

    function getOnRejectedOrElse(onRejected, defaultOnRejected) {
      return (typeof fail !== "undefined")? onRejected : defaultOnRejected;
    }

    that.getRequest = function(path, onFulfilled, onRejected) {
      onRejected = getOnRejectedOrElse(function(xhr, status, err) {
        console.error("get request failed." + " err: " + err);
      });

      $.ajax({
        type: "GET",
        url: path,
        dataType: 'json'
      }).then(onFulfilled, onRejected);
    };

    that.postRequest = function(path, data, onFulfilled, onRejected) {
      onRejected = getOnRejectedOrElse(function(xhr, status, err) {
        console.error("post request failed." +
                      " data: " + JSON.stringify(data) + " err: " + err);
      });

      $.ajax({
        type: "POST",
        url: path,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json'
      }).then(onFulfilled, onRejected);
    };

    that.deleteRequest = function(path, data, onFulfilled, onRejected) {
      onRejected = getOnRejectedOrElse(function(xhr, status, err) {
        console.error("delete request failed." +
                      " data: " + JSON.stringify(data) + " err: " + err);
      });

      $.ajax({
        type: "DELETE",
        url: path
      }).then(onFulfilled, onRejected);
    };

    return that;
  };

  enjo.model = function() {
    var that = {};

    that.bindParams = function(model, params) {
      return util.enjoListener(model, ENJO_EVENT_MODEL_UPDATE, params);
    };

    return that;
  };

  enjo.viewModel = function() {
    var that = {};

    that.init = function(model, onUpdate) {
      $(model).on(ENJO_EVENT_MODEL_UPDATE, onUpdate);
    };

    that.bindParams = function(viewModel, params) {
      return util.enjoListener(viewModel, ENJO_EVENT_VIEW_MODEL_UPDATE, params);
    };

    return that;
  };

  enjo.view = function() {
    var that = {};

    that.init = function(viewModel, onUpdate) {
      $(viewModel).on(ENJO_EVENT_VIEW_MODEL_UPDATE, onUpdate);
    };

    return that;
  };

  return enjo;
});
