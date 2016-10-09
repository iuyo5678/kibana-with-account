var Joi = require('joi');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var slug = require('slug');


var Status = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);
  }
});


Status._collection = 'statuses';


Status._idClass = String;


Status.schema = Joi.object().keys({
  _id: Joi.string(),
  pivot: Joi.string().required(),
  name: Joi.string().required()
});


Status.indexes = [
  [{pivot: 1}],
  [{name: 1}]
];


Status.create = function (pivot, name, callback) {

  var document = {
    _id: slug(pivot + ' ' + name).toLowerCase(),
    pivot: pivot,
    name: name
  };

  this.insertOne(document, function (err, docs) {

    if (err) {
      return callback(err);
    }

    callback(null, docs[0]);
  });
};


module.exports = Status;
