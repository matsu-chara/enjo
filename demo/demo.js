(function() {
  "use strict";

  // namespace todo
  var todo = todo || {};

  todo.Repository = function(enjoR) {
    var that = {};

    that.gettodos = function(done) {
      // enjoR.get("/todo", done);
    };

    that.posttodo = function(todo, done) {
      setTimeout(function(){
        // enjoR.post("/todo", todo, done);
      }, 1000);
    };

    that.deletetodo = function(todo, done) {
      // enjoR.delete("/todo/" + todo.id, done);
    };
    return that;
  };

  todo.Model = function(repository, enjoM) {
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

      repository.posttodo(todo, function(registeredtodo){
        todo.id = registeredtodo.id;
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

  todo.FormViewModel = function($view, model, enjoVm) {
    // view dependencies
    var $url     = $view.find("#todo-url");
    var $content = $view.find("#todo-content");
    var $submit  = $view.find("#todo-submit");

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

    function construct() {
      render();
      enjoVm.init(model, onUpdate);
    }

    function render() {
    }

    function onUpdate(event, data) {
    }

    construct();
  };

  todo.ListViewModel = function($view, model, enjoVm) {
    function construct() {
      render([]);
      enjoVm.init(model, onUpdate);
    }

    function render(todos) {
      var ul = createtodoList(todos);
      $view.html(ul);
    }

    function onUpdate(event, data) {
      render(data.todos);
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

    construct();
  };

  $(document).ready(function(){
    // dependent views
    var $containerView = $("#todo-container");
    var $listView = $containerView.children("#todo-list");
    var $formView = $containerView.children("#todo-form");

    var e = enjo($);
    var todoRepository = todo.Repository(e.Repository());
    var todoModel = todo.Model(todoRepository, e.Model());
    todo.ListViewModel($listView, todoModel, e.ViewModel());
    todo.FormViewModel($formView, todoModel, e.ViewModel());

    todoModel.init();
  });
}());
