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
        role: ['user', function (done, results) {

          if (!results.user) {
            return done();
          }

          results.user.hydrateRole(done);
        }],
        scope: ['role', function (done, results) {

          if (!results.role || !results.role.scope) {
            return done();
          }

          done(null, results.role.scope);
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
        if (request.auth.credentials.role.name) {
          return request.auth.credentials.role.name === group;
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
