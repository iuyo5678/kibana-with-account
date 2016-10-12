var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({basePath: ''}, options);


  server.route({
    method: 'GET',
    path: options.basePath + '/admin-role',
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

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;
      var query = {};
      if (request.query.name) {
        query.name = new RegExp('^.*?' + request.query.name + '.*$', 'i');
      }
      var fields = request.query.fields;
      var sort = request.query.sort;
      var limit = request.query.limit;
      var page = request.query.page;

      AdminRole.pagedFind(query, fields, sort, limit, page, function (err, results) {

        if (err) {
          return reply(err);
        }

        reply(results);
      });
    }
  });


  server.route({
    method: 'GET',
    path: options.basePath + '/admin-role/{id}',
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

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;

      AdminRole.findById(request.params.id, function (err, adminRole) {

        if (err) {
          return reply(err);
        }

        if (!adminRole) {
          return reply({message: 'Document not found.'}).code(404);
        }

        reply(adminRole);
      });
    }
  });


  server.route({
    method: 'POST',
    path: options.basePath + '/admin-role',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      validate: {
        payload: {
          name: Joi.string().required()
        }
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;
      var name = request.payload.name;

      AdminRole.create(name, function (err, adminRole) {

        if (err) {
          return reply(err);
        }

        reply(adminRole);
      });
    }
  });


  server.route({
    method: 'PUT',
    path: options.basePath + '/admin-role/{id}',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      validate: {
        payload: {
          name: Joi.string().required()
        }
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;
      var id = request.params.id;
      var update = {
        $set: {
          name: request.payload.name
        }
      };

      AdminRole.findByIdAndUpdate(id, update, function (err, adminRole) {

        if (err) {
          return reply(err);
        }

        if (!adminRole) {
          return reply({message: 'Document not found.'}).code(404);
        }

        reply(adminRole);
      });
    }
  });


  server.route({
    method: 'PUT',
    path: options.basePath + '/admin-role/{id}/permissions',
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      },
      validate: {
        payload: {
          permissions: Joi.object().required()
        }
      },
      pre: [
        AuthPlugin.preware.ensureAdminGroup('root')
      ]
    },
    handler: function (request, reply) {

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;
      var id = request.params.id;
      var update = {
        $set: {
          permissions: request.payload.permissions
        }
      };

      AdminRole.findByIdAndUpdate(id, update, function (err, adminRole) {

        if (err) {
          return reply(err);
        }

        reply(adminRole);
      });
    }
  });


  server.route({
    method: 'DELETE',
    path: options.basePath + '/admin-role/{id}',
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

      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;

      AdminRole.findByIdAndDelete(request.params.id, function (err, adminRole) {

        if (err) {
          return reply(err);
        }

        if (!adminRole) {
          return reply({message: 'Document not found.'}).code(404);
        }

        reply({message: 'Success.'});
      });
    }
  });


  next();
};


exports.register.attributes = {
  name: 'admin-role'
};
