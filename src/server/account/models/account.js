var Joi = require('joi');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var StatusEntry = require('./status-entry');
var NoteEntry = require('./note-entry');


var Account = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);
  }
});


Account._collection = 'accounts';


Account.schema = Joi.object().keys({
  _id: Joi.object(),
  name: Joi.string().required(),
  permissions: Joi.object().description('{ permission: boolean, ... }'),
  timeCreated: Joi.date()
});


Account.indexes = [
  [{'name': 1}]
];


Account.create = function (name, callback) {

  var document = {
    name: name.toLowerCase(),
    timeCreated: new Date()
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};


Account.findByUsername = function (username, callback) {

  var query = {'name': username.toLowerCase()};
  this.findOne(query, callback);
};


module.exports = Account;
