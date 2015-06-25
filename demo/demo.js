var enjoComponents;

(function() {
  "use strict";

  // namespace todo
  var todo = todo || {};

  // repository {{{
  todo.repository = function(enjoR) {
    var that = {};

    that.gettodos = function(done) {
      enjoR.getRequest("http://localhost:3000/todos", done);
    };

    that.posttodo = function(todo, done) {
      setTimeout(function(){
        enjoR.postRequest("http://localhost:3000/todos", todo, done);
      }, 1000);
    };

    that.deletetodo = function(todo, done) {
      enjoR.deleteRequest("http://localhost:3000/todos/" + todo.id, done);
    };
    return that;
  };
  // }}}

  // model {{{
  todo.model = function(repository, enjoM) {
    var that = {};

    var fire = enjoM.bindParams(that, {
      todos: []
    });

    that.init = function() {
      // 初回更新
      updateRequest();

      // 定期的に更新
      setInterval(updateRequest, 3 * 1000);
    };

    that.newtodo = function(url, content) {
      return {id: null, url: url, content: content};
    };

    that.isRegistering = function(todo) {
      return todo.id === null;
    };

    that.remove = function(todo) {
      // 登録中のものは削除しない(idが無いので削除出来ない)
      if (that.isRegistering(todo)) {
        return;
      }

      // 対象要素以外を抽出する形で更新
      var notDeletingtodos = fire.get("todos").filter(function(m) {
        return m !== todo;
      });
      fire.set("todos", notDeletingtodos);

      repository.deletetodo(todo);
    };

    that.add = function(todo) {
      fire.set("todos", fire.get("todos").concat(todo));

      repository.posttodo(todo, function(registeredTodos){
        fire.set("todos", fire.get("todos").filter(function(m) {
          return m !== todo;
        }));

        updateRequest();
      });
    };

    that.validate = function (todo) {
      var err = "";
      if (todo.content === "") {
        err += "表示文字列が空白です。";
      }
      if (!todo.url.match("^http")) {
        err += "URLがhttpから開始していません。";
      }
      return err;
    };

    function updateRequest() {
      repository.gettodos(function(_todos){
        var todos = fire.get("todos");

        // 登録中のものを上書きしないように最新のリストを取得
        var registeringtodos = todos.filter(that.isRegistering);
        fire.set("todos", _todos.concat(registeringtodos));
      });
    }

    return that;
  };
  // }}}

  todo.formViewModel = function(model, enjoVm) {
    var that = {};

    that.params = enjoVm.bindParams(that, {
      content: "テストTodo",
      url: "http://google.com",
      submit: {
        callback: function(e) {
          e.preventDefault();
          console.log([fire.get("content"), fire.get("url")].join(", "));
        }
      }
    });

    function construct() {
      enjoVm.init(model, onUpdate);
    }

    function onUpdate(event, data) {
      // nothing to do
    }

    construct();
    return that;
  };

  todo.formView = function($rootView, viewModel, enjoV) {
    var that = {};

    function construct() {
      enjoV.init(viewModel, onUpdate);
      render(viewModel.params);
    }

    function onUpdate(event, updatedParams) {
      render(viewModel.params);
    }

    function render(params) {
      var html = $([
        "<form id='todo-form'>",
          "<div>",
            "<label>表示文字列:",
              "<input type='text' name='todo-content' id='todo-content'",
                "onChange=" + "enjoComponents.formParams.set('content', 'aaa')",
                "value='" + params.get("content") + "'>",
            "</label>",
          "</div>",
          "<div>",
            "<label>リンク先:",
              "<input type='text' name='todo-url' id='todo-url'",
                "onChange=" + "enjoComponents.formParams.set('url', 'bbb')",
                " value='" + params.get("url") + "'>",
            "</label>",
          "</div>",
          "<div>",
            "<button id='todo-submit'",
              "onclick=" + 'enjoComponents.formParams.get("submit").callback(event)' + ">送信",
            "</button>",
          "</div>",
        "</form>"
      ].join("\n"));

      $rootView.html(html);
    }

    construct();
    return that;
  };

  $(document).ready(function(){
    // dependent views
    var $containerDiv = $("#todo-container");
    var $formDiv      = $containerDiv.children("#todo-form");

    var e = enjo($);
    var todoRepository    = todo.repository(e.repository());
    var todoModel         = todo.model(todoRepository, e.model());
    var todoFormViewModel = todo.formViewModel(todoModel, e.viewModel());
    todo.formView($formDiv, todoFormViewModel, e.view());

    enjoComponents = {
      formParams: todoFormViewModel.params
    };
  });
}());
