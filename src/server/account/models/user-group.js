var Joi = require('joi');
var Async = require('async');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var slug = require('slug');


var UserGroup = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);
  },
  hasPermissionTo: function (permission) {

    if (this.permissions && this.permissions.hasOwnProperty(permission)) {
      return this.permissions[permission];
    }

    return false;
  }
});


UserGroup._collection = 'userGroups';
UserGroup._idClass = String;

UserGroup.schema = Joi.object().keys({
  _id: Joi.string(),
  name: Joi.string().required(),
  index: Joi.string().required()
});

UserGroup.indexes = [
  [{name: 1}, {unique: true}]
];

UserGroup.create = function (name, callback) {
  var indexSuffix = Math.random().toString(36).substr(2);
  var document = {
    _id: slug(name).toLowerCase(),
    name: name,
    index: '.'.concat((name).toLowerCase(), indexSuffix)
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};

UserGroup.findGroupById = function (name, callback) {
  var self = this;
  Async.auto({
    group: function (done) {
      var query = {
        _id: name
      };

      self.findOne(query, done);
    }
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    return callback(null, results.group);

  });

};

module.exports = UserGroup;
