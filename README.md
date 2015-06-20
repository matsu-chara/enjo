# enjo.js

> jQueryしか使えない！そんなときでも大丈夫。

enjo.jsはjQueryに依存した双方向データバインディングができるMVVMフレームワークです。

たぶん・・・( ⁰⊖⁰)

勉強用なので実用性はありません。プロダクトで使うと炎上します。


## 使い方

### 初期化

enjoはjQueryに依存しているので

`var e = enjo($);`としてjQueryを渡しましょう。
あとは`e.Repository`や`e.Model()`, `e.ViewModel`をそれぞれのオブジェクトに
渡してあげればOkです。

```javascript
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
```

### Repository

MVVMなのに何故かRepositoryがありますが、これは`$.ajax`の薄い（そして不完全な）ラッパーですので、使わなくても大丈夫です。

下記のようにコールバックを指定して簡単にリクエストを飛ばすことが出来ます。

```javascript
enjoR.get("/todo", done);
```

ｲﾁｵｳﾍﾞﾝﾘ( ⁰⊖⁰)

### Model

モデルの値は専用の`getter/setter`で管理します。
setterで値を変更すると`enjo-update`というイベントが飛ぶので、
それをViewModelで取得してViewを書き換えることが出来ます。

```
var that = {};
var enjoM = enjo($).Model();

/*
 * 値の更新時に$(bindParamsの第一引数).trigger("enjo-update", bindParamsの第二引数)という
 * イベントが飛ぶ。
 */
var fire = enjoM.bindParams(that, {
  todos: []
});

// getの例
var t = fire.get("todos");

// setの例
fire.set("todos", t);
};
```

### ViewModel

ViewとBindしたい値をセットにして、bindParamsメソッドに渡せば、
Viewのchangedイベントを取得して、値を自動的に反映してくれます。
また、`fire.set`メソッドで値を更新すれば、viewにも自動的に反映してくれます。

好きなViewに対してカスタムeventとコールバックをbindすることも可能です。


```javascript
var enjoVm = enjo($).ViewModel();

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
        if(model.validate(m)) {
        model.add(m);
        }
    }
    }
});
```

Viewからの変更ではなくてモデルの変更を受け取りたい場合は、
constructorで`enjoVm.init`よんであげましょう。
変更を受け取りたいモデルと、コールバックを渡すと、
モデルの変更のたびにコールバックが呼ばれます。

```javascript
function construct() {
    enjoVm.init(model, onUpdate);
}
```
