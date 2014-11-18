var adapter = require('..')();
var Bookshelf = require('bookshelf');
var tests = require('factory-girl/lib/adapter-tests');
var config = require('config-node')();
var Bookshelf = require('bookshelf');

describe('Bookshelf adapter', function() {
  init();

  var Model = Bookshelf.db.Model.extend({
    tableName: 'test'
  });
  tests(adapter, Model, countModels);
  function countModels(cb) {
    Model.query().count('id as count').then(function(result) {
      return cb(null, result[0].count);
    }, cb);
  }
});

function init() {
  var knex = require('knex')(config.database);
  Bookshelf.db = Bookshelf.initialize(knex);

  before(function() {
    return knex.schema.dropTableIfExists('test')
      .then(function() {
        return knex.schema.createTable('test', function(table) {
          table.increments();
          table.string('name');
        });
      });
  });
}
