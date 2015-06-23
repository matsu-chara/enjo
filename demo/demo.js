(function() {
  "use strict";

  // namespace todo
  var todo = todo || {};

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

  todo.model = function(repository, enjoM) {
    var that = {};

    var fire = enjoM.bindParams(that, {
      todos: []
    });

    that.init = function() {
      // 初回更新
      update();

      // 定期的に更新
      setInterval(update, 3 * 1000);
    };

    that.newtodo = function(url, content) {
      return {id: null, url: url, content: content};
    };

    that.isRegistering = function(todo) {
      return todo.id === null;
    };

    that.remove = function(todo) {
      if (that.isRegistering(todo)) {
        // return;
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

        update();
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

    function update() {
      repository.gettodos(function(_todos){
        var todos = fire.get("todos");

        // 登録中のものを上書きしないように最新のリストを取得
        var registeringtodos = todos.filter(that.isRegistering);
        fire.set("todos", _todos.concat(registeringtodos));
      });
    }

    return that;
  };

  todo.formViewModel = function($views, model, enjoVm) {
    function construct() {
      enjoVm.init(model, onUpdate);
    }

    function onUpdate(event, data) {
    }

    construct();
  };

  todo.formView = function($viewModel) {
    var that = {};

    var $url     = $views.url;
    var $content = $views.content;
    var $submit  = $views.submit;

    function render() {
    }

    // viewとbindされた値(setで値を更新すればViewにも反映される)
    // eventとコールバックをbindすることも可能
    var fire = enjoVm.bindParams({
      url: {
        $view: $url,
        value: "http://google.com"
      },
      content: {
        $view: $content,
        value: "テストTodo"
      },
      submit: {
        $view: $submit,
        event: "click",
        callback: function(e, fire) {
          e.preventDefault();
          var m = model.newtodo(
            fire.get("url"),
            fire.get("content")
          );
          var err = model.validate(m);
          if(err === "") {
            model.add(m);
          } else {
            console.error(err);
          }
        }
      }
    });
    construct();
    return that;
  };

  todo.listViewModel = function(model, enjoVm) {
    function construct() {
      enjoVm.init(model, onUpdate);
    }

    function onUpdate(event, data) {
      render(data.todos);
    }
  };

  todo.listView = function() {
    function render(todos) {
      var ul = createtodoList(todos);
      $view.html(ul);
    }

    // Todo配列をulに変換
    function createtodoList(todos) {
      var ul = $("<ul>").attr("id", "todo-ul");

      todos.forEach(function(todo) {
        var li = createtodoItem(todo);
        ul.append(li);
      });
      return ul;
    }

    // Todoをliに変換
    function createtodoItem(todo) {
      var li = $("<li>").addClass("todo-item");

      var deleteButton = $("<button>")
                          .addClass("todo-delete")
                          .text("削除")
                          .click(function() {
                            model.remove(todo);
                          });

      var span = $("<span>")
                  .addClass("todo-content")
                  .css("color", (todo.id === null)? "#ff0000" : "")
                  .text(todo.content + ": ");

      var a = $("<a>")
                .addClass("todo-anchor")
                .attr("href", todo.url)
                .attr("target", "_blank")
                .text(todo.url);

      /*
        <li>
          <button>
          <span><a></span>
        </li>
      */
      return li.append(deleteButton).append(span.append(a));
    }
  };

  $(document).ready(function(){
    // dependent views
    var $containerView = $("#todo-container");
    var $listView = $containerView.children("#todo-list");
    var $formView = $containerView.children("#todo-form");
    var $formViews = {
      url: $formView.find("#todo-url"),
      content : $formView.find("#todo-content"),
      submit : $formView.find("#todo-submit")
    };

    var e = enjo($);
    var todoRepository = todo.repository(e.repository());
    var todoModel = todo.model(todoRepository, e.model());
    todo.listViewModel($listView, todoModel, e.viewModel());
    todo.formViewModel($formViews, todoModel, e.viewModel());

    todoModel.init();
  });
}());
