var Joi = require('joi');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Slug = require('slug');


var AdminRole = BaseModel.extend({
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


AdminRole._collection = 'adminRole';


AdminRole.schema = Joi.object().keys({
  _id: Joi.string(),
  name: Joi.string().required(),
  permissions: Joi.object().description('{ permission: boolean, ... }'),
  scope: Joi.array().unique().required()
});

AdminRole.indexes = [
  [{'name': 1}]
];

AdminRole.create = function (name, scope, callback) {

  var document = {
    name: name,
    scope: scope
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};

AdminRole.findByUsername = function (name, callback) {

  var query = {'name': name.toLowerCase()};
  this.findOne(query, callback);
};

module.exports = AdminRole;
