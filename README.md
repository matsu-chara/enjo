# enjo

[![Bower version](https://badge.fury.io/bo/enjo.svg)](http://badge.fury.io/bo/enjo)
[![Build Status](https://travis-ci.org/matsu-chara/enjo.svg)](https://travis-ci.org/matsu-chara/enjo)
[![Code Climate](https://codeclimate.com/github/matsu-chara/enjo/badges/gpa.svg)](https://codeclimate.com/github/matsu-chara/enjo)

> jQueryしか使えない！そんなときでも大丈夫。

enjoはjQueryに依存した双方向データバインディングができるフロントエンドフレームワークです。

MVVMっぽく作りたかったですが、ViewModelがViewに依存しているのでちょっと怪しいですね(´･_･`)

勉強用なので実用性はありません。プロダクトで使うと炎上します。

## demo

`demo`にTodoリストのサンプルがあります。
`demo/index.html`を開けばひと通りの動作を試すことが出来ます。

そのままでも動きますが、

```
GET    /todos
POST   /todos
DELETE /todos/:id
```

のようなルーティングでよしなにやるサーバーを立てると、
DBへ保存するまでの一連の流れを実行することが出来ます。

サンプルとして[json-server](https://github.com/typicode/json-server)を利用した物を用意してあります。

```sh
cd demo
$(npm bin)/json-server db.json
```

とすると`localhost:3000`に簡易サーバーが立つので、
`demo/index.html`をブラウザで開いて試してみてください。

## 使い方

### インストール

下記のどちらかの方法で入手することができます。

```sh
# リポジトリをclone
git clone https://github.com/matsu-chara/enjo

# bowerもOK
bower install enjo
```

### 初期化

HTMLでの読込は例えば以下のように行えます。

```html
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="../lib/enjo.js"></script>
<script src="main.js"></script>
```

JavaScriptでは、以下のように初期化を行います。

まず、enjoはjQueryに依存しているので
`var e = enjo($);`としてjQueryを渡しましょう。

あとは`e.repository`や`e.model()`, `e.viewModel`をそれぞれのオブジェクトに
渡してあげればOKです。

```javascript
$(document).ready(function(){
  // dependent views
  var $containerView = $("#todo-container");
  var $listView = $containerView.children("#todo-list");
  var $formView = $containerView.children("#todo-form");

  var e = enjo($);
  var todoRepository = todo.repository(e.repository());
  var todoModel = todo.model(todoRepository, e.model());
  todo.listViewModel($listView, todoModel, e.viewModel());
  todo.formViewModel($formView, todoModel, e.viewModel());

  todoModel.init();
});
```

### repository

repositoryは`$.ajax`の薄い（そして不完全な）ラッパーですので、使わなくても大丈夫です。

下記のようにコールバックを指定して簡単にリクエストを飛ばすことが出来ます。

```javascript
enjoR.getRequest("/todo", done);
```

ｲﾁｵｳﾍﾞﾝﾘ( ⁰⊖⁰)

### model

モデルの値は専用の`getter/setter`で管理します。
setterで値を変更すると`enjo-update`というイベントが飛ぶので、
それをviewModelで取得してViewを書き換えることが出来ます。

```javascript
var that = {};
var enjoM = enjo($).model();

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
```

### viewModel

viewとBindしたい値をセットにして、bindParamsメソッドに渡せば、
viewのchangedイベントを取得して、値を自動的に反映してくれます。
また、`fire.set`メソッドで値を更新すれば、viewにも自動的に反映してくれます。

好きなviewに対してカスタムeventとコールバックをbindすることも可能です。


```javascript
var enjoVm = enjo($).viewModel();

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

viewからの変更ではなくてモデルの変更を受け取りたい場合は、
constructorで`enjoVm.init`よんであげましょう。
変更を受け取りたいモデルと、コールバックを渡すと、
モデルの変更のたびにコールバックが呼ばれます。

```javascript
function construct() {
  enjoVm.init(model, onUpdate);
}
```
