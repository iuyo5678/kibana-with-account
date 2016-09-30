var Async = require('async');

exports.register = function (server, options, next) {

    var Session = server.plugins['hapi-mongo-models'].Session;
    var User = server.plugins['hapi-mongo-models'].User;


    server.auth.strategy('session', 'cookie', {
        password: '~k3yb04rdK4tz!',
        cookie: 'sid-kibana',
        isSecure: false,
        redirectTo: '/login',
        keepAlive: true,
        ttl: 24 * 60 * 60 * 1000,
        validateFunc: function (request, data, callback) {

            Async.auto({
                session: function (done) {

                    var id = data.session._id;
                    var key = data.session.key;
                    Session.findByCredentials(id, key, done);
                },
                user: ['session', function (done, results) {

                    if (!results.session) {
                        return done();
                    }

                    User.findById(results.session.userId, done);
                }],
                roles: ['user', function (done, results) {

                    if (!results.user) {
                        return done();
                    }

                    results.user.hydrateRoles(done);
                }],
                scope: ['user', function (done, results) {

                    if (!results.user || !results.user.roles) {
                        return done();
                    }

                    done(null, Object.keys(results.user.roles));
                }]
            }, function (err, results) {

                if (err) {
                    return callback(err);
                }

                if (!results.session) {
                    return callback(null, false);
                }

                callback(null, Boolean(results.user), results);
            });
        }
    });


    next();
};


exports.preware = {};


exports.preware.ensureAdminGroup = function (groups) {

    return {
        assign: 'ensureAdminGroup',
        method: function (request, reply) {

            if (Object.prototype.toString.call(groups) !== '[object Array]') {
                groups = [groups];
            }

            var groupFound = groups.some(function (group) {
                if (request.auth.credentials.roles.admin) {
                   return request.auth.credentials.roles.admin.name == group;
                }

            });

            if (!groupFound) {
                var response = {
                    message: 'Permission denied to this resource.'
                };

                return reply(response).takeover().code(403);
            }

            reply();
        }
    };
};


exports.register.attributes = {
    name: 'auth'
};
