var Joi = require('joi');
var Async = require('async');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Slug = require('slug');


var UserRequest = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);
  }

});


UserRequest._collection = 'userRequest';

UserRequest.schema = Joi.object().keys({
  _id: Joi.object(),
  user: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().lowercase().required()
  }),
  opType: Joi.string().required(),
  opParameter: Joi.object().description('{ name: value, ... }'),
  isClosed: Joi.boolean().default(false),
  executor: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().lowercase().required()
  }),
  timeCreated: Joi.date(),
  timeExecutor: Joi.date()
});

UserRequest.indexes = [
  [{'user.id': 1}],
  [{'user.name': 1}]
];

UserRequest.create = function (user, opType, opParameter, callback) {

  var document = {
    user: user,
    opType: opType,
    opParameter: opParameter,
    timeCreated: new Date(),
    isClosed: false
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};


module.exports = UserRequest;
