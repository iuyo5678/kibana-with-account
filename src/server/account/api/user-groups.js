var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/user-groups',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin', 'account']
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

        },
        handler: function (request, reply) {

            var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;
            var query = {};
            if (request.query.name) {
                query.name = new RegExp('^.*?' + request.query.name + '.*$', 'i');
            }
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            UserGroup.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });

    server.route({
        method: 'GET',
        path: options.basePath + '/user-groups/{id}',
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

            var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;

            UserGroup.findGroupById(request.params.id, function (err, userGroup) {

                if (err) {
                    return reply(err);
                }

                if (!userGroup) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(userGroup);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/user-groups',
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

            var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;
            var name = request.payload.name;

            UserGroup.create(name, function (err, userGroup) {

                if (err) {
                    return reply(err);
                }

                reply(userGroup);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/user-groups/{id}',
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

            var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;

            UserGroup.findByIdAndDelete(request.params.id, function (err, userGroup) {

                if (err) {
                    return reply(err);
                }

                if (!userGroup) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'user-groups'
};
