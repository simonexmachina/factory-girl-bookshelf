# factory-girl-bookshelf

[![Build Status](https://travis-ci.org/aexmachina/factory-girl-bookshelf.png)](https://travis-ci.org/aexmachina/factory-girl-bookshelf)

A [Bookshelf](http://bookshelfjs.org/) adapter for [factory-girl](https://github.com/aexmachina/factory-girl).

## Usage

```js
require('factory-girl-bookshelf')();
```

Or, if you want to specify which models it should be used for:

```js
require('factory-girl-bookshelf')(['User', 'Foo', 'Bar']);
```

Relationships can be created using `assoc`:

```js
var Model = Bookshelf.db.Model;
var Parent = Model.extend({
  children: function() {
    return this.hasMany(Child, 'parent_id');
  }
});
var Child = Model.extend({
  parent: function() {
    return this.belongsTo(Parent, 'parent_id');
  }
});
factory.define('parent', Parent);
factory.define('child', Child, {
  parent_id: factory.assoc('parent', 'id')
});
```
