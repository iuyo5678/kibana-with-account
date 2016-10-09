var Joi = require('joi');
var Async = require('async');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var AdminGroup = require('./admin-group');
var Slug = require('slug');

var Admin = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);

    Object.defineProperty(this, '_groups', {
      writable: true,
      enumerable: false
    });
  },
  isMemberOf: function (group) {

    if (!this.groups) {
      return false;
    }

    return this.groups.hasOwnProperty(group);
  },
  hydrateGroups: function (callback) {

    if (!this.groups) {
      this._groups = {};
      return callback(null, this._groups);
    }

    if (this._groups) {
      return callback(null, this._groups);
    }

    var self = this;
    var tasks = {};

    Object.keys(this.groups).forEach(function (group) {

      tasks[group] = function (done) {

        AdminGroup.findById(group, done);
      };
    });

    Async.auto(tasks, function (err, results) {

      if (err) {
        return callback(err);
      }

      self._groups = results;

      callback(null, self._groups);
    });
  },
  hasPermissionTo: function (permission, callback) {

    if (this.permissions && this.permissions.hasOwnProperty(permission)) {
      return callback(null, this.permissions[permission]);
    }

    var self = this;

    this.hydrateGroups(function (err) {

      if (err) {
        return callback(err);
      }

      var groupHasPermission = false;

      Object.keys(self._groups).forEach(function (group) {

        if (self._groups[group].hasPermissionTo(permission)) {
          groupHasPermission = true;
        }
      });

      callback(null, groupHasPermission);
    });
  }
});


Admin._collection = 'admins';


Admin.schema = Joi.object().keys({
  _id: Joi.object(),
  user: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().lowercase().required()
  }),
  groups: Joi.object().description('{ groupId: name, ... }'),
  permissions: Joi.object().description('{ permission: boolean, ... }'),
  name: Joi.string().required(),
  timeCreated: Joi.date()
});


Admin.indexes = [
  [{'user.id': 1}],
  [{'user.name': 1}]
];


Admin.create = function (name, callback) {

  var document = {
    name: name,
    timeCreated: new Date()
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};


Admin.findByUsername = function (username, callback) {

  var query = {'user.name': username.toLowerCase()};
  this.findOne(query, callback);
};


module.exports = Admin;
