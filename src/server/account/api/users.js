var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');
var Async = require('async');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/users',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().token().lowercase().allow(''),
                    isActive: Joi.string().allow(''),
                    role: Joi.string().allow(''),
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

            var User = request.server.plugins['hapi-mongo-models'].User;
            var query = {};
            if (request.query.username) {
                query.username = new RegExp('^.*?' + request.query.username + '.*$', 'i');
            }
            if (request.query.isActive) {
                query.isActive = request.query.isActive === 'true';
            }
            if (request.query.role) {
                query['roles.' + request.query.role] = { $exists: true };
            }
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            User.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/users/{id}',
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

            var User = request.server.plugins['hapi-mongo-models'].User;

            User.findById(request.params.id, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/users/my',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin', 'account']
            }
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var id = request.auth.credentials.user._id.toString();
            var fields = User.fieldsAdapter('username email group roles');

            User.findById(id, fields, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found. That is strange.' }).code(404);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/users',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;
                        var conditions = {
                            username: request.payload.username
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Username already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;
                        var conditions = {
                            email: request.payload.email
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Email already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var username = request.payload.username;
            var email = request.payload.email;
            var password = request.payload.password;

            User.create(username, password, email, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    server.route({
    method: 'GET',
    path: options.basePath + '/users/group',
    config: {
      auth: {
        strategy: 'session',
        scope: ['admin', 'account']
      }
    },
    handler: function (request, reply) {

      var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;

      var id = request.auth.credentials.user.group.toString();

      UserGroup.findGroupById(id, function (err, group) {
        if(err) {
          return reply(err);
        }
        if(!group) {
          return reply({ message: 'Document not found. That is strange.' }).code(404);
        }
        reply(group);
      });
    }
  });

  server.route({
    method: 'PUT',
    path: options.basePath + '/users/group',
    config: {
      auth: {
        strategy: 'session',
        scope: 'account'
      },
      validate: {
        payload: {
          opParameter: Joi.object().required(),
          opType: Joi.string().required(),
          userEmail: Joi.string().required()
        }
      },
      pre: [
        {
          assign: "user",
          method: function (request, reply) {
            var User = request.server.plugins['hapi-mongo-models'].User;
            var conditions = {
              email : request.payload.userEmail
            };
            User.findOne(conditions, function (err, user) {
              if(err) {
                return reply(user)
              }

              if(!user) {
                var response = {
                  message: 'the User not found'
                };

                return reply(response).takeover().code(404);
              }
              reply(user)
            })
          }
        },{
          assign: 'operateCheck',
          method: function (request, reply) {
            var UserRequest = request.server.plugins['hapi-mongo-models'].UserRequest;
            var user = {
              id: request.pre.user._id.toString(),
              name: request.pre.user.username.toString()
            };
            var conditions = {
              user: user,
              opType: request.payload.opType,
              isClosed: false
            };
            UserRequest.findOne(conditions, function (err, userRequest) {
              if(err) {
                return reply(err);
              }
              if(userRequest) {
                var response = {
                  message: '你已经提交了相同的需求, 请处理后再提交!'
                };

                return reply(response).takeover().code(403);
              }
              reply(true);
            });
          }
        },{
          assign: 'groupCheck',
          method: function (request, reply) {

            var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;
            var conditions = {
              name: request.payload.opParameter.newGroup
            };

            UserGroup.findOne(conditions, function (err, userGroup) {

              if (err) {
                return reply(err);
              }

              if (!userGroup) {
                var response = {
                  message: 'the userGroup not found'
                };

                return reply(response).takeover().code(404);
              }

              reply(userGroup);
            });
          }
        }
      ]
    },
    handler: function (request, reply) {

      var UserRequest = request.server.plugins['hapi-mongo-models'].UserRequest;
      var user = {
        id: request.pre.user._id.toString(),
        name: request.pre.user.username.toString()
      };

      UserRequest.create(user, request.payload.opType, request.payload.opParameter, function (err, userRequest) {
        if(err) {
          return reply(err);
        }

        reply(userRequest)
      });
    }
  });

    server.route({
        method: 'PUT',
        path: options.basePath + '/users/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    isActive: Joi.boolean().required(),
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;
                        var conditions = {
                            username: request.payload.username,
                            _id: { $ne: User._idClass(request.params.id) }
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Username already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;
                        var conditions = {
                            email: request.payload.email,
                            _id: { $ne: User._idClass(request.params.id) }
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Email already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var id = request.params.id;
            var update = {
                $set: {
                    isActive: request.payload.isActive,
                    username: request.payload.username,
                    email: request.payload.email
                }
            };

            User.findByIdAndUpdate(id, update, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/users/my',
        config: {
            auth: {
                strategy: 'session',
                scope: ['account', 'admin']
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [{
                assign: 'usernameCheck',
                method: function (request, reply) {

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var conditions = {
                        username: request.payload.username,
                        _id: { $ne: request.auth.credentials.user._id }
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            var response = {
                                message: 'Username already in use.'
                            };

                            return reply(response).takeover().code(409);
                        }

                        reply(true);
                    });
                }
            }, {
                assign: 'emailCheck',
                method: function (request, reply) {

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var conditions = {
                        email: request.payload.email,
                        _id: { $ne: request.auth.credentials.user._id }
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            var response = {
                                message: 'Email already in use.'
                            };

                            return reply(response).takeover().code(409);
                        }

                        reply(true);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;

            var id = request.auth.credentials.user._id.toString();
            var update = {
                $set: {
                    username: request.payload.username,
                    email: request.payload.email
                }
            };
            var findOptions = {
                fields: User.fieldsAdapter('username email roles')
            };

            User.findByIdAndUpdate(id, update, findOptions, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/users/{id}/password',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    password: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'password',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;

                        User.generatePasswordHash(request.payload.password, function (err, hash) {

                            if (err) {
                                return reply(err);
                            }

                            reply(hash);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var id = request.params.id;
            var update = {
                $set: {
                    password: request.pre.password.hash
                }
            };

            User.findByIdAndUpdate(id, update, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/users/my/password',
        config: {
            auth: {
                strategy: 'session',
                scope: ['account', 'admin']
            },
            validate: {
                payload: {
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'password',
                method: function (request, reply) {

                    var User = request.server.plugins['hapi-mongo-models'].User;

                    User.generatePasswordHash(request.payload.password, function (err, hash) {

                        if (err) {
                            return reply(err);
                        }

                        reply(hash);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var id = request.auth.credentials.user._id.toString();
            var update = {
                $set: {
                    password: request.pre.password.hash
                }
            };
            var findOptions = {
                fields: User.fieldsAdapter('username email')
            };

            User.findByIdAndUpdate(id, update, findOptions, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/users/{id}',
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

            var User = request.server.plugins['hapi-mongo-models'].User;

            User.findByIdAndDelete(request.params.id, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'users'
};
