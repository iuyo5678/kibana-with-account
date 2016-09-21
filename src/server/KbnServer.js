let { constant, once, compact, flatten } = require('lodash');
let { promisify, resolve, fromNode } = require('bluebird');
let Hapi = require('hapi');

let utils = require('requirefrom')('src/utils');
let rootDir = utils('fromRoot')('.');
let pkg = utils('packageJson');

module.exports = class KbnServer {
  constructor(settings) {
    this.name = pkg.name;
    this.version = pkg.version;
    this.build = pkg.build || false;
    this.rootDir = rootDir;
    this.settings = settings || {};

    this.ready = constant(this.mixin(
        // 加载相关的配置信息
        require('./config/setup'), // sets this.config, reads this.settings
        // 这一步配置http服务器相关信息，route connectconfig，本质是一个hapi.server
        require('./http'), // sets this.server
        // 配置logging
        require('./logging'),
        // 配置status页面，就是/status页面信息
        require('./status'),

        // 查找所有的有效plugin，并且放入kbnServer.plugins中
        require('./plugins/scan'),

        // 验证是否有未加载成功的打印到log
        require('./config/complete'),

        // 加载用户账户管理相关配置信息
        require('./account'),

        // 这一步加载界面相关的配置
        require('../ui'),

        // ensure that all bundles are built, or that the
        // lazy bundle server is running
        require('../optimize'),

        // finally, initialize the plugins
        require('./plugins/initialize'),

      () => {
        if (this.config.get('server.autoListen')) {
          this.ready = constant(resolve());
          return this.listen();
        }
      }
    ));

    this.listen = once(this.listen);
  }

  /**
   * Extend the KbnServer outside of the constraits of a plugin. This allows access
   * to APIs that are not exposed (intentionally) to the plugins and should only
   * be used when the code will be kept up to date with Kibana.
   *
   * @param {...function} - functions that should be called to mixin functionality.
   *                         They are called with the arguments (kibana, server, config)
   *                         and can return a promise to delay execution of the next mixin
   * @return {Promise} - promise that is resolved when the final mixin completes.
   */
  // 这一步是核心，会将上面用到该函数的相关功能注入到相关配置中，
  async mixin(...fns) {
    for (let fn of compact(flatten(fns))) {
      await fn.call(this, this, this.server, this.config);
    }
  }

  /**
   * Tell the server to listen for incoming requests, or get
   * a promise that will be resolved once the server is listening.
   *
   * @return undefined
   */
  async listen() {
    let { server, config } = this;

    await this.ready();
    await fromNode(cb => server.start(cb));
    await require('./pid')(this, server, config);

    server.log(['listening', 'info'], 'Server running at ' + server.info.uri);
    return server;
  }

  async close() {
    await fromNode(cb => this.server.stop(cb));
  }

  async inject(opts) {
    if (!this.server) await this.ready();

    return await fromNode(cb => {
      try {
        this.server.inject(opts, (resp) => {
          cb(null, resp);
        });
      } catch (err) {
        cb(err);
      }
    });
  }
};
