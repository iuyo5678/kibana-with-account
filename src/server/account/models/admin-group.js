var Joi = require('joi');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Slug = require('slug');


var AdminGroup = BaseModel.extend({
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


AdminGroup._collection = 'adminGroups';


AdminGroup.schema = Joi.object().keys({
  _id: Joi.string(),
  name: Joi.string().required(),
  permissions: Joi.object().description('{ permission: boolean, ... }')
});

AdminGroup.indexes = [
  [{'name': 1}]
];

AdminGroup.create = function (name, callback) {

  var document = {
    name: name
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};

AdminGroup.findByUsername = function (name, callback) {

  var query = {'name': name.toLowerCase()};
  this.findOne(query, callback);
};

module.exports = AdminGroup;
