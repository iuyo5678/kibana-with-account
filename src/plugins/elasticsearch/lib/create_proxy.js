var createAgent = require('./create_agent');
var mapUri = require('./map_uri');
var preResponse = require('./pre_process_response')
var { resolve } = require('url');

module.exports = function createProxy(server, method, route, config) {

  var pre = '/elasticsearch';
  var sep = route[0] === '/' ? '' : '/';
  var path = `${pre}${sep}${route}`;
  var options = {
    method: method,
    path: path,
    handler: {
      proxy: {
        mapUri: mapUri(server),
        passThrough: true,
        agent: createAgent(server),
        xforward: true,
        onResponse: preResponse(server)
      }
    },
  };

  if (config) options.config = config;

  server.route(options);
};

