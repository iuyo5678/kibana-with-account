/**
 * Created by zhangguhua on 7/26/16.
 */
module.exports = (kbnServer, server, config) => {
  let webpack = require('webpack');
  var transferWebpackPlugin = require('transfer-webpack-plugin');
  var less = require('less');
  let _ = require('lodash');
  let { join } = require('path');
  let { resolve } = require('path');
  let Config = require('./config');
  let warning = _.bindKey(server, 'log', ['plugins', 'warning']);
  let serverPlugins =  {
    'hapi-auth-basic': {},
    'hapi-auth-cookie': {},
    'crumb': {
      restful: true
    },
    'lout': {},
    'hapi-mongo-models': {
      mongodb: Config.get('/hapiMongoModels/mongodb'),
      models: {
        Account: resolve(__dirname, './models/account'),
        AdminGroup: resolve(__dirname, './models/admin-group'),
        Admin: resolve(__dirname, './models/admin'),
        AuthAttempt: resolve(__dirname, './models/auth-attempt'),
        Session: resolve(__dirname, './models/session'),
        Status: resolve(__dirname, './models/status'),
        UserGroup: resolve(__dirname, './models/user-group'),
        User: resolve(__dirname, './models/user'),
        UserRequest: resolve(__dirname, './models/user-request')
      },
      autoIndex: true
    },
    './auth': {},
    './mailer': {},
    './api/accounts': { basePath: '/api' },
    './api/admin-groups': { basePath: '/api' },
    './api/user-groups': { basePath: '/api' },
    './api/admins': { basePath: '/api' },
    './api/auth-attempts': { basePath: '/api' },
    './api/index': { basePath: '/api' },
    './api/login': { basePath: '/api' },
    './api/logout': { basePath: '/api' },
    './api/sessions': { basePath: '/api' },
    './api/signup': { basePath: '/api' },
    './api/user-request': { basePath: '/api' },
    './api/users': { basePath: '/api' },
    './web/about': {},
    './web/account': {},
    './web/admin': {},
    './web/home': {},
    './web/login': {},
    './web/public': {},
    './web/signup': {}
  };

  let pluginNames = _.keys(serverPlugins);
  for (let name of pluginNames) {
    server.register({
      register: require(name),
      options: serverPlugins[name]
    }, function (err) {
      if (err) {
        warning({ tmpl: 'unable to register plugin name : <%= name %> in server account module', name: name });
      }
    });
  }
  //let createProxy = require('./proxy/create_proxy');

  //createProxy(server, 'GET','/admin_control', '/{paths*}');
  //createProxy(server, 'GET','/static', '/{paths*}');

  let commonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
  let uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

  let webpackConfig = {
      entry: {
        account: resolve(__dirname, './client/pages/account/index'),
        admin: resolve(__dirname, './client/pages/admin/index'),
        contact: resolve(__dirname, './client/pages/contact/index'),
        login: resolve(__dirname, './client/pages/login/index'),
        signup: resolve(__dirname, './client/pages/signup/index')
      },
      output: {
        path: join(config.get('optimize.bundleDir'), './public/pages'),
        filename: '[name].min.js',
        sourceMapFilename: '[name].map.js'
      },
      resolve: {
        extensions: ['', '.js', '.jsx', '.less']
      },
      module: {
        loaders: [
          { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
        ]
      },
      devtool: 'source-map',
      plugins: [
        new commonsChunkPlugin('../core.min.js', undefined, 2),
        new uglifyJsPlugin({ compress: { warnings: false } }),
        new transferWebpackPlugin([
          { from: resolve(__dirname, './client/media'), to: '../media' }
        ])
      ]
    };

  webpack(webpackConfig, function (err, stats) {
      if (err) {
        throw err;
      }
    });

  var bundleConfigs = [{
    entries: './client/core/bootstrap.less',
    dest: './public',
    outputName: 'core.min.css'
  }, {
    entries: './client/layouts/default.less',
    dest: './public/layouts',
    outputName: 'default.min.css'
  }, {
    entries: './client/pages/account/index.less',
    dest: './public/pages',
    outputName: 'account.min.css'
  }, {
    entries: './client/pages/admin/index.less',
    dest: './public/pages',
    outputName: 'admin.min.css'
  }, {
    entries: './client/pages/home/index.less',
    dest: './public/pages',
    outputName: 'home.min.css'
  }];

  var Gulp = require('gulp');
  var Newer = require('gulp-newer');
  var Concat = require('gulp-concat');
  var Less = require('gulp-less');

  bundleConfigs.map(function (bundleConfig) {

    Gulp.src(resolve(__dirname, bundleConfig.entries))
      .pipe(Newer(join(config.get('optimize.bundleDir'), bundleConfig.dest, bundleConfig.outputName)))
      .pipe(Concat(bundleConfig.outputName))
      .pipe(Less({ compress: true }))
      .pipe(Gulp.dest(join(config.get('optimize.bundleDir'), bundleConfig.dest)));
  });


};
