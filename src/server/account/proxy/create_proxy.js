var createAgent = require('./create_agent');
var mapUri = require('./map_uri');
module.exports = function createProxy(server, method, pre, route) {

  //var pre = '/admin_control';
  var sep = route[0] === '/' ? '' : '/';
  var path = `${pre}${sep}${route}`;
  var options = {
    method: method,
    path: path,
    config: {
      auth: {
        strategy: 'session',
        scope: 'admin'
      }
    },
    handler: {
      proxy: {
        mapUri: mapUri(server),
        passThrough: true,
        agent: createAgent(server),
        xforward: true
      }
    },
  };


  server.route(options);
};

