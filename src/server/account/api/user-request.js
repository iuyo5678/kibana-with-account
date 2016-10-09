var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');
var Async = require('async');


exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({basePath: ''}, options);


  server.route({
    method: 'GET',
    path: options.basePath + '/user-request',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      validate: {
        query: {
          name: Joi.string().allow(''),
          fields: Joi.string(),
          sort: Joi.string().default('_id'),
          limit: Joi.number().default(20),
          page: Joi.number().default(1)
        }
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {

      var UserRequest = request.server.plugins['hapi-mongo-models'].UserRequest;
      var query = {};

      var fields = request.query.fields;
      var sort = request.query.sort;
      var limit = request.query.limit;
      var page = request.query.page;

      UserRequest.pagedFind(query, fields, sort, limit, page, function (err, results) {

        if (err) {
          return reply(err);
        }

        reply(results);
      });
    }
  });


  server.route({
    method: 'GET',
    path: options.basePath + '/user-request/{id}',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {

      var UserRequest = request.server.plugins['hapi-mongo-models'].UserRequest;

      UserRequest.findById(request.params.id, function (err, userRequest) {

        if (err) {
          return reply(err);
        }

        if (!userRequest) {
          return reply({message: 'Document not found.'}).code(404);
        }

        reply(userRequest);
      });
    }
  });


  server.route({
    method: 'PUT',
    path: options.basePath + '/user-request/{id}',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      validate: {
        payload: {
          opType: Joi.string().required(),
          id: Joi.string().required(),
          username: Joi.string().required(),
          oldGroup: Joi.string(),
          newGroup: Joi.string()
        }
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {
      var User = request.server.plugins['hapi-mongo-models'].User;
      var UserRequest = request.server.plugins['hapi-mongo-models'].UserRequest;
      Async.auto({
        user: function (done) {
          var userFilter = {
            username: request.payload.username,
            group: request.payload.oldGroup
          };
          var userUpdate = {
            $set: {
              group: request.payload.newGroup
            }
          };
          User.findOneAndUpdate(userFilter, userUpdate, done);
        },
        requestFinish: ['user', function (done, results) {
          var id = request.params.id;
          var update = {
            $set: {
              isClosed: true,
              timeExecutor: new Date()
            }
          };
          UserRequest.findByIdAndUpdate(id, update, done);
        }]
      }, function (err, results) {
        if (err) {
          return reply(err);
        }
        if (!results.user) {
          return reply({message: 'User not found.'}).code(404);
        }
        if (!results.requestFinish) {
          return reply({message: 'The UserRequest not found.'}).code(404);
        }
        reply(results);
      });


      var id = request.params.id;
      var update = {
        $set: {
          isClosed: true,
          timeExecutor: new Date()
        }
      };


    }
  });


  next();
};


exports.register.attributes = {
  name: 'user-request'
};
