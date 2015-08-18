var adapter = require('..')();
var Factory = require('factory-girl').Factory;
var tests = require('factory-girl/lib/adapter-tests');
var config = require('config-node')();
var Bookshelf = require('bookshelf');

describe('Bookshelf adapter', function() {
  init();

  var Model = Bookshelf.db.Model;
  var TestModel = Model.extend({
    tableName: 'test'
  });

  tests(adapter, TestModel, countModels);
  function countModels(cb) {
    TestModel.query().count('id as count').then(function(result) {
      return cb(null, result[0].count);
    }, cb);
  }

  describe('assoc just works', function() {
    var factory, Parent, Child;
    before(function() {
      factory = new Factory();
      factory.setAdapter(adapter);

      Parent = Model.extend({
        tableName: 'test',
        children: function() {
          return this.hasMany(Child, 'parent_id');
        }
      });
      Child = Model.extend({
        tableName: 'children',
        parent: function() {
          return this.belongsTo(Parent, 'parent_id');
        }
      });

      factory.define('parent', Parent);
      factory.define('child', Child, {
        parent_id: factory.assoc('parent', 'id')
      });
    });
    it('creates hasMany', function(done) {
      factory.create('child', function(err, child) {
          if (err) return done(err);
          child.should.be.an.instanceof(Child);
          child.parent().fetch({withRelated: 'children'})
            .then(function(parent) {
              parent.should.be.an.instanceof(Parent);
              parent.related('children').length.should.equal(1);
              done();
            });
      });
    });
  });

});

function init() {
  var knex = require('knex')(config.database);
  Bookshelf.db = Bookshelf.initialize(knex);

  before(function() {
    return knex.schema.dropTableIfExists('test')
      .then(function() {
        return knex.schema.dropTableIfExists('test')
      })
      .then(function() {
        return knex.schema.createTable('test', function(table) {
          table.increments();
          table.string('name');
        });
      })
      .then(function () {
        return knex.schema.createTable('children', function(table) {
          table.increments();
          table.integer('parent_id').references('test.id');
        });
      });
  });
}
