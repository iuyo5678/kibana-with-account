var Joi = require('joi');
var Async = require('async');
var Bcrypt = require('bcryptjs');
var objectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var AdminRole = require('./admin-role');
var Admin = require('./admin');


var User = BaseModel.extend({
  constructor: function (attrs) {

    objectAssign(this, attrs);

    Object.defineProperty(this, '_role', {
      writable: true,
      enumerable: false
    });
  },
  canPlayRole: function (role) {

    if (!this.role) {
      return false;
    }

    return this.role.hasOwnProperty(role);
  },
  hydrateRole: function (callback) {

    if (!this.role) {
      this._role = {};
      return callback(null, this._role);
    }

    if (this._role) {
      return callback(null, this._role);
    }

    var self = this;
    var tasks = {};

    tasks.role = function (done) {

      AdminRole.findById(self.role.id, done);
    };




    Async.auto(tasks, function (err, results) {

      if (err) {
        return callback(err);
      }

      self._role = results.role;

      callback(null, self._role);
    });
  }
});


User._collection = 'users';


User.schema = Joi.object().keys({
  _id: Joi.object(),
  isActive: Joi.boolean().default(true),
  username: Joi.string().token().lowercase().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string(),
  role: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required()
  }),
  group: Joi.string().required(),
  resetPassword: Joi.object().keys({
    token: Joi.string().required(),
    expires: Joi.date().required()
  }),
  timeCreated: Joi.date()
});


User.indexes = [
  [{username: 1}, {unique: true}],
  [{email: 1}, {unique: true}]
];


User.generatePasswordHash = function (password, callback) {

  Async.auto({
    salt: function (done) {

      Bcrypt.genSalt(10, done);
    },
    hash: ['salt', function (done, results) {

      Bcrypt.hash(password, results.salt, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    callback(null, {
      password: password,
      hash: results.hash
    });
  });
};

User.create = function (username, password, email, callback) {

  var self = this;

  Async.auto({
    passwordHash: this.generatePasswordHash.bind(this, password),
    newUser: ['passwordHash', function (done, results) {

      var document = {
        isActive: true,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: results.passwordHash.hash,
        group: 'default',
        timeCreated: new Date()
      };

      self.insertOne(document, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    results.newUser[0].password = results.passwordHash.password;

    callback(null, results.newUser[0]);
  });
};


User.findByCredentials = function (username, password, callback) {

  var self = this;

  Async.auto({
    user: function (done) {

      var query = {
        isActive: true
      };

      if (username.indexOf('@') > -1) {
        query.email = username.toLowerCase();
      }
      else {
        query.username = username.toLowerCase();
      }

      self.findOne(query, done);
    },
    passwordMatch: ['user', function (done, results) {

      if (!results.user) {
        return done(null, false);
      }

      var source = results.user.password;
      Bcrypt.compare(password, source, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    if (results.passwordMatch) {
      return callback(null, results.user);
    }

    callback();
  });
};


User.findByUsername = function (username, callback) {

  var query = {username: username.toLowerCase()};
  this.findOne(query, callback);
};


module.exports = User;
