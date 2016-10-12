#!/usr/bin/env node
var Fs = require('fs');
var Path = require('path');
var Async = require('async');
var Promptly = require('promptly');
var Mongodb = require('mongodb');
var Handlebars = require('handlebars');


var configTemplatePath = Path.resolve(__dirname, '../../config/config.example');
var configPath = Path.resolve(__dirname, '../server/account/config.js');


if (process.env.NODE_ENV === 'test') {
  var options = { encoding: 'utf-8' };
  var source = Fs.readFileSync(configTemplatePath, options);
  var configTemplate = Handlebars.compile(source);
  var context = {
    projectName: 'kibana-account',
    mongodbUrl: 'mongodb://localhost:27017/kibana-account',
    rootEmail: 'root@root',
    rootPassword: 'root',
    systemEmail: 'sys@tem',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpUsername: '',
    smtpPassword: ''
  };
  Fs.writeFileSync(configPath, configTemplate(context));
  console.log('Setup complete.');
  process.exit(0);
}

Async.auto({
  projectName: function (done) {

    Promptly.prompt('Project name: (kibana-account)', { default: 'kibana-account' }, done);
  },
  mongodbUrl: ['projectName', function (done, results) {

    var promptOptions = {
      default: 'mongodb://localhost:27017/kibana-account'
    };

    Promptly.prompt('MongoDB URL: (mongodb://localhost:27017/kibana-account)', promptOptions, done);
  }],
  testMongo: ['rootPassword', function (done, results) {

    Mongodb.MongoClient.connect(results.mongodbUrl, {}, function (err, db) {

      if (err) {
        console.error('Failed to connect to Mongodb.');
        return done(err);
      }

      db.close();
      done(null, true);
    });
  }],
  rootEmail: ['mongodbUrl', function (done, results) {

    Promptly.prompt('Root user email:', done);
  }],
  rootPassword: ['rootEmail', function (done, results) {

    Promptly.password('Root user password:', { default: null }, done);
  }],
  systemEmail: ['rootPassword', function (done, results) {

    var promptOptions = {
      default: results.rootEmail
    };

    Promptly.prompt('System email: (' + results.rootEmail + ')', promptOptions, done);
  }],
  smtpHost: ['systemEmail', function (done, results) {

    Promptly.prompt('SMTP host: (smtp.gmail.com)', { default: 'smtp.gmail.com' }, done);
  }],
  smtpPort: ['smtpHost', function (done, results) {

    Promptly.prompt('SMTP port: (465)', { default: 465 }, done);
  }],
  smtpUsername: ['smtpPort', function (done, results) {

    var promptOptions = {
      default: results.systemEmail
    };

    Promptly.prompt('SMTP username: (' + results.systemEmail + ')', promptOptions, done);
  }],
  smtpPassword: ['smtpUsername', function (done, results) {

    Promptly.password('SMTP password:', done);
  }],
  createConfig: ['smtpPassword', function (done, results) {

    var fsOptions = { encoding: 'utf-8' };

    Fs.readFile(configTemplatePath, fsOptions, function (err, src) {

      if (err) {
        console.error('Failed to read config template.');
        return done(err);
      }

      var configTemplateResult = Handlebars.compile(src);
      Fs.writeFile(configPath, configTemplateResult(results), done);
    });
  }],
  setupRootUser: ['createConfig', function (done, results) {

    var BaseModel = require('hapi-mongo-models').BaseModel;
    var User = require('../server/account/models/user');
    var Admin = require('../server/account/models/admin');
    var AdminRole = require('../server/account/models/admin-role');
    var UserGroup = require('../server/account/models/user-group');
    var UserRequest = require('../server/account/models/user-request');
    var Session = require('../server/account/models/session');

    Async.auto({
      connect: function (done) {

        BaseModel.connect({ url: results.mongodbUrl }, done);
      },
      clean: ['connect', function (done) {
        Async.parallel([
          User.deleteMany.bind(User, {}),
          Admin.deleteMany.bind(Admin, {}),
          AdminRole.deleteMany.bind(AdminRole, {}),
          UserGroup.deleteMany.bind(UserGroup, {}),
          UserRequest.deleteMany.bind(UserRequest, {}),
          Session.deleteMany.bind(Session, {})
        ], done);
      }],
      adminRoleDefault: ['clean', function (done) {
        AdminRole.create('default', ['account'], done);
      }],
      adminRoleRoot: ['clean', function (done) {
        AdminRole.create('root', ['admin'], done);
      }],
      admin: ['clean', function (done) {
        Admin.create('Admin', done);
      }],
      userGroup:['clean', function (done) {

        UserGroup.create('default', done);
      }],
      user: ['clean', function (done, dbResults) {

        User.create('root', results.rootPassword, results.rootEmail, done);
      }],

      adminMembership: ['admin', function (done, dbResults) {

        var id = dbResults.admin._id.toString();
        var update = {
          $set: {
            groups: {
              root: 'root'
            }
          }
        };

        Admin.findByIdAndUpdate(id, update, done);
      }],
      linkUser: ['admin', 'adminRoleRoot', 'user', function (done, dbResults) {

        var id = dbResults.user._id.toString();
        var update = {
          $set: {
            'role': {
              id: dbResults.adminRoleRoot._id.toString(),
              name: dbResults.adminRoleRoot.name.toString()
            },
            group: 'default'
          }
        };

        User.findByIdAndUpdate(id, update, done);
      }],
      linkAdmin: ['admin', 'user', function (done, dbResults) {

        var id = dbResults.admin._id.toString();
        var update = {
          $set: {
            user: {
              id: dbResults.user._id.toString(),
              name: 'root'
            }
          }
        };

        Admin.findByIdAndUpdate(id, update, done);
      }]
    }, function (err, dbResults) {

      if (err) {
        console.error('Failed to setup root user.');
        return done(err);
      }

      done(null, true);
    });
  }]
}, function (err, results) {

  if (err) {
    console.error('Setup failed.');
    console.error(err);
    return process.exit(1);
  }

  console.log('Setup complete.');
  process.exit(0);
});
