var Joi = require('joi');
var Hoek = require('hoek');
var Async = require('async');
var Config = require('../config');


exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({basePath: ''}, options);


  server.route({
    method: 'POST',
    path: options.basePath + '/signup',
    config: {
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      auth: {
        mode: 'try',
        strategy: 'session'
      },
      validate: {
        payload: {
          email: Joi.string().email().lowercase().required(),
          username: Joi.string().token().lowercase().required(),
          password: Joi.string().required()
        }
      },
      pre: [{
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
      }]
    },
    handler: function (request, reply) {

      var User = request.server.plugins['hapi-mongo-models'].User;
      var UserGroup = request.server.plugins['hapi-mongo-models'].UserGroup;
      var AdminRole = request.server.plugins['hapi-mongo-models'].AdminRole;
      var Session = request.server.plugins['hapi-mongo-models'].Session;
      var mailer = request.server.plugins.mailer;

      Async.auto({
        user: function (done) {

          var username = request.payload.username;
          var password = request.payload.password;
          var email = request.payload.email;

          User.create(username, password, email, done);
        },
        adminRole: ['user', function (done, results) {
          AdminRole.findByUsername('default', done);
        }],

        linkAccount: ['adminRole', function (done, results) {

          var id = results.user._id.toString();
          var update = {
            $set: {
              role: {
                id: results.adminRole._id.toString(),
                name: results.adminRole.name
              },
              group: 'default'
            }
          };

          User.findByIdAndUpdate(id, update, done);
        }],
        welcome: ['linkAccount', function (done, results) {

          var emailOptions = {
            subject: 'Your ' + Config.get('/projectName') + ' account',
            to: {
              name: request.payload.name,
              address: request.payload.email
            }
          };
          var template = 'welcome';

          mailer.sendEmail(emailOptions, template, request.payload, function (err) {

            if (err) {
              console.warn('sending welcome email failed:', err.stack);
            }
          });

          done();
        }],
        session: ['linkAccount', function (done, results) {

          Session.create(results.user._id.toString(), done);
        }],
        group: ['linkAccount', function (done, results) {
          UserGroup.findGroupByName(results.user.group, done);
        }]
      }, function (err, results) {

        if (err) {
          return reply(err);
        }

        var user = results.linkAccount;
        var group = results.group;
        var credentials = user.username + ':' + results.session.key;
        var authHeader = 'Basic ' + new Buffer(credentials).toString('base64');
        var result = {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            index: group.index
          },
          session: results.session,
          authHeader: authHeader
        };

        request.auth.session.set(result);
        reply(result);
      });
    }
  });


  next();
};


exports.register.attributes = {
  name: 'signup'
};
