var factory = require('factory-girl'),
    Adapter = factory.Adapter;

var BookshelfAdapter = function() {};
BookshelfAdapter.prototype = new Adapter();
BookshelfAdapter.prototype.build = function(Model, props) {
  return new Model(props);
};
BookshelfAdapter.prototype.get = function(doc, attr, Model) {
  return doc.get(attr);
};
BookshelfAdapter.prototype.set = function(props, doc, Model) {
  return doc.set(props);
};
BookshelfAdapter.prototype.save = function(doc, Model, cb) {
  doc.save(null, { method: 'insert' }).nodeify(cb);
};
BookshelfAdapter.prototype.destroy = function(doc, Model, cb) {
  if (!doc.id) return process.nextTick(cb);
  doc.destroy().nodeify(cb);
};

var adapter = new BookshelfAdapter();
module.exports = function(models) {
  if (models) {
    for (var i = 0; i < models.length; i++) {
      factory.setAdapter(adapter, models[i]);
    }
  }
  else {
    factory.setAdapter(adapter);
  }
  return adapter;
};

module.exports.BookshelfAdapter = BookshelfAdapter;
